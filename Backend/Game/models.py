from django.db import models
from core.settings import IMAGES_ROOT_
from rest_framework import serializers
from User_Management.serializers import UserSerializer
from User_Management.models import User



class Acheivement(models.Model):

    name = models.CharField(max_length=50)
    icon_path = models.ImageField(upload_to=IMAGES_ROOT_)
    users = models.ManyToManyField("User_Management.User", related_name="acheivements")


class Match(models.Model):

    enemy = models.ForeignKey(
        "User_Management.User", null=True, on_delete=models.SET_NULL
    )
    score = models.IntegerField(default=0)
    enemy_match = models.OneToOneField(
        "Game.Match", null=True, on_delete=models.SET_NULL
    )
    played_at = models.TimeField(auto_now=True)

    MATCH_MODES = ((0, "Classic"), (1, "Ranked"), (2, "Tournement"))
    mode = models.IntegerField(choices=MATCH_MODES)
    
    @staticmethod 
    def get_mode_name(mode_name):
        for choice in Match.MATCH_MODES:
            if choice[1] == mode_name:
                return choice[0]
        raise serializers.ValidationError("Invalid mode name provided.")
        
    
    @staticmethod 
    def get_mode_value(mode_key):
        for choice in Match.MATCH_MODES:
            if choice[0] == mode_key:
                return choice[1]
            

    
    user = models.ForeignKey(
        "User_Management.User",
        related_name="matches",
        null=True,
        on_delete=models.SET_NULL,
    )


class Grade(models.Model):

    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to=IMAGES_ROOT_)


class Items(models.Model):
    """represent items that User have and current used item"""

    ITEM_TYPES = (
        ("padels", "Padels"),
        ("badges", "Badges"),
        ("boards", "Boards"),
    )

    user = models.ForeignKey(
        "User_Management.User",
        related_name="items",
        null=True,
        on_delete=models.SET_NULL,
    )
    item_class = models.CharField(max_length=10, choices=ITEM_TYPES)
    owned_items = models.ManyToManyField("Game.Item", related_name="owned_by")
    current_item = models.ForeignKey(
        "Game.Item", on_delete=models.SET_NULL, null=True, related_name="in_use"
    )

    # ''' get current_item object of the <item_class> object'''

    def SerializeItem(self, item_id):
        # define the type of item && fetch it && serialize it
        from .serilaizers import PadelSerializer, BadgeSerializer, BoardSerializer

        serializer = None
        if self.item_class == 'padels':
            obj: Padel = Padel.objects.get(id=item_id)
            serializer = PadelSerializer(obj)
        elif self.item_class == 'badges':
            obj: Badge = Badge.objects.get(id=item_id)
            serializer = BadgeSerializer(obj)
        elif self.item_class == 'boards':
            obj: Board = Board.objects.get(id=item_id)
            serializer = BoardSerializer(obj)

        return serializer


    def Serialize_owned_items(self):
        #seriqlize the owned item and creat array of owned serialized
        ownedItems = self.owned_items.all()
        serializedItem = []        

        for item in ownedItems:
            data = self.SerializeItem(item.id).data
            serializedItem.append(data)

        return serializedItem
    
    def get_owned_items(self):
        return self.owned_items.all()

    def equip_item(self, item_id):
        #equip item take item_id is the item to be equiped => current_item
        from .serilaizers import ItemsSerializer
        
        owned_items = self.get_owned_items()
        found = False
        for item in owned_items:
            if int(item_id) == int(item.id):
                found = True

        if not found:
            raise  Exception("You dont owen this item")

        data = {'current_item' : item_id}
        serialiezd = ItemsSerializer(instance=self, data=data, partial=True)
        if serialiezd.is_valid():
            serialiezd.save()
        else:
            raise  Exception(serialiezd.errors)
        
        return serialiezd.data

    @classmethod
    def check_type(cls, item_id, type):

        obj = None
        if type == 'padels':
            obj = Padel.objects.get(id=item_id)
        elif type == 'badges':
            obj = Badge.objects.get(id=item_id)
        else:
            obj = Board.objects.get(id=item_id)
        
        return obj

    @classmethod
    def create_item(cls, item, user, type):
        from .serilaizers import ItemsSerializer

        if item.price > user.info.wallet:
            raise Exception("You dont have enough money")
        data = {'user': user.id, 'item_class' : type, 'owned_items' : [int(item.id)], 'current_item' : int(item.id)}
        serialized = ItemsSerializer(data=data)
        if serialized.is_valid():
            serialized.save()
            user.info.wallet = user.info.wallet - item.price
            user.info.save()
            
            ownedObjs = serialized.data['owned_items']
            owned = []
            for ownedObj in ownedObjs:
                owned.append(ownedObj['id'])

            return owned
        else:
            raise Exception(serialized.errors)


    @classmethod
    def add_item(cls, obj, user, item_id):
        from .serilaizers import ItemsSerializer

        owned_items = obj.get_owned_items()
        found = False
        for item in owned_items:
            if int(item_id) == int(item.id):
                found = True
                break
        if found:
            raise  Exception("You Already owen this item")
        
        if item.price > user.info.wallet:
                raise Exception("You dont have enough money")
        user.info.wallet = user.info.wallet - item.price
        user.info.save()
        obj.owned_items.add(item_id)
        obj.save()
        serialized = ItemsSerializer(obj)
        ownedObjs = serialized.data['owned_items']
        owned = []
        for ownedObj in ownedObjs:
            owned.append(ownedObj['id'])
        
        return owned

    @classmethod
    def buy_item(cls , type, item_id, user : User):

        #check if new_item match the type
        item = cls.check_type(item_id, type)

        try:
            obj : Items = cls.objects.get(user=user, item_class=type)
        except cls.DoesNotExist:
            #create new items object (user, item_class,  owned_item, current_item)
            return cls.create_item(item, user, type)

        #add new items object (to owned_items)
        return cls.add_item(obj, user, item_id)
        


class Item(models.Model):    
    price = models.IntegerField()
    image_path = models.ImageField(upload_to=IMAGES_ROOT_)


class Padel(Item):

    name = models.CharField(max_length=50)
    definition = models.TextField()
    # ability = None # !
    # special = None # !


class Badge(Item):

    color = models.CharField(max_length=7, default="#FF0000")


class Board(Item):

    name = models.CharField(max_length=50)
