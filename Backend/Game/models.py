from django.db import models
from core.settings import IMAGES_ROOT_
from User_Management.models import User
from django.db.models import F
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class Acheivement(models.Model):

    name = models.CharField(max_length=50, unique=True)
    icon_path = models.ImageField(upload_to=IMAGES_ROOT_)
    users = models.ManyToManyField(
        "User_Management.User", related_name="acheivements", blank=True
    )

    @staticmethod
    def owner_of(user: User, acheivement_name: str) -> bool:
        return user.acheivements.filter(name=acheivement_name).exists()

class Match(models.Model):

    enemy = models.ForeignKey(
        "User_Management.User", null=True, on_delete=models.SET_NULL
    )
    score = models.IntegerField(default=0)
    tournament = models.ForeignKey(
        "Tournament.Tournament", null=True, on_delete=models.CASCADE
    )
    enemy_match = models.ForeignKey(
        "Game.Match", null=True, on_delete=models.SET_NULL, blank=True
    )
    played_at = models.TimeField(auto_now_add=True)
    is_played = models.BooleanField(default=False)

    MATCH_MODES = ((0, "Classic"), (1, "Ranked"), (2, "Tournement"))
    mode = models.IntegerField(choices=MATCH_MODES)

    user = models.ForeignKey(
        "User_Management.User",
        related_name="matches",
        null=True,
        on_delete=models.SET_NULL,
    )

    @staticmethod
    def send_accept_play(user: User, friend: User, room_name):
        from User_Management.Consumers.Notifconsumers import NotificationConsumer
        from User_Management.models import Notification

        # send notification to the tow user match is ready to play
        to = [user.username, friend.username]
        Userquery = User.objects.filter(username__in=to)
        content = {
            "to": Userquery,
            "type": "G",
            "content": {"type": "start", "room_name": room_name},
        }
        channel_layer = get_channel_layer()
        notification = Notification.createToMultiUsers(user, content)
        data = notification.as_serialized()
        for playername in to:
            try:
                channel_name = NotificationConsumer.get_channel_by_user(playername)
                async_to_sync(channel_layer.send)(
                    channel_name,
                    {"type": "redirect", "content": data},
                )
            except:
                pass

    @staticmethod
    def create(user: User, enemy: User, mode: int, tournament=None):
        match1 = Match(user=user, enemy=enemy, mode=mode)
        match2 = Match(user=enemy, enemy=user, mode=mode)
        if tournament and mode == 2:
            match1.tournament = tournament
            match2.tournament = tournament
        match1.save()
        match2.save()
        match1.enemy_match = match2
        match2.enemy_match = match1
        return [match1, match2]

    def set_score(self, score, exp, save=True):
        self.score = score
        if self.user:
            self.user.info.add_exp(exp)
        self.is_played = True
        if save:
            self.save()

    @staticmethod
    def getAllMatches(user):
        from .serilaizers import MatchSerializer

        matches = user.matches.filter(is_played=True).order_by("-played_at")
        matches_serialized = MatchSerializer(matches, many=True).data
        return matches_serialized

    @staticmethod
    def getLstMatch(user):
        from .serilaizers import MatchSerializer

        matches = user.matches.filter(is_played=True)
        if not matches.exists():
            return ""
        last_match = matches.latest("played_at")
        enemy: User = last_match.enemy
        last_match_serialized = MatchSerializer(last_match).data
        last_match_serialized["enemy"]["info"] = enemy.get_info()
        return last_match_serialized

    @staticmethod
    def getWinning(user):
        winning_count = Match.objects.filter(
            user=user, score__gt=F("enemy_match__score")
        ).count()
        return winning_count

    @staticmethod
    def getLoses(user):
        winning_count = Match.objects.filter(
            user=user, score__lt=F("enemy_match__score")
        ).count()
        return winning_count

    @property
    def is_winner(self):
        return True if self.score > self.enemy_match.score else False

    @staticmethod
    def last_match_between(player1: User, player2: User):
        matchs = Match.objects.filter(user=player1, enemy=player2)
        last_match = matchs.order_by("-played_at").first()
        if not last_match:
            raise Exception("No matchs")
        return last_match


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
    @staticmethod
    def set_default_items(user):
        try:
            default_board: Board = Board.objects.get(name="default")
            board_item: Items = Items(
                user=user, item_class="boards", current_item=default_board
            )
            board_item.save()
            board_item.owned_items.add(default_board)
        except:
            pass

    def SerializeItem(self, item_id):
        # define the type of item && fetch it && serialize it
        from .serilaizers import PadelSerializer, BadgeSerializer, BoardSerializer

        serializer = None
        if self.item_class == "padels":
            obj: Padel = Padel.objects.get(id=item_id)
            serializer = PadelSerializer(obj)
        elif self.item_class == "badges":
            obj: Badge = Badge.objects.get(id=item_id)
            serializer = BadgeSerializer(obj)
        elif self.item_class == "boards":
            obj: Board = Board.objects.get(id=item_id)
            serializer = BoardSerializer(obj)

        return serializer

    def Serialize_owned_items(self):
        # seriqlize the owned item and creat array of owned serialized
        ownedItems = self.owned_items.all()
        serializedItem = []

        for item in ownedItems:
            data = self.SerializeItem(item.id).data
            serializedItem.append(data)

        return serializedItem

    def get_owned_items(self):
        return self.owned_items.all()

    def equip_item(self, item_id):
        # equip item take item_id is the item to be equiped => current_item
        from .serilaizers import ItemsSerializer

        owned_items = self.get_owned_items()
        found = False
        for item in owned_items:
            if int(item_id) == int(item.id):
                found = True

        if not found:
            raise Exception("You dont owen this item")

        data = {"current_item": item_id}
        serialiezd = ItemsSerializer(instance=self, data=data, partial=True)
        if serialiezd.is_valid():
            serialiezd.save()
        else:
            raise Exception(serialiezd.errors)

        return serialiezd.data

    @classmethod
    def check_type(cls, item_id, type):

        obj = None
        if type == "padels":
            obj = Padel.objects.get(id=item_id)
        elif type == "badges":
            obj = Badge.objects.get(id=item_id)
        else:
            obj = Board.objects.get(id=item_id)

        return obj

    @classmethod
    def create_item(cls, item, user, type):
        from .serilaizers import ItemsSerializer

        if item.price > user.info.wallet:
            raise Exception("You dont have enough money")
        data = {
            "user": user.id,
            "item_class": type,
            "owned_items": [int(item.id)],
            "current_item": int(item.id),
        }
        serialized = ItemsSerializer(data=data)
        if serialized.is_valid():
            serialized.save()
            user.info.wallet = user.info.wallet - item.price
            user.info.save()

            ownedObjs = serialized.data["owned_items"]
            owned = []
            for ownedObj in ownedObjs:
                owned.append(ownedObj["id"])

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
            raise Exception("You Already owen this item")

        if item.price > user.info.wallet:
            raise Exception("You dont have enough money")
        user.info.wallet = user.info.wallet - item.price
        user.info.save()
        obj.owned_items.add(item_id)
        obj.save()
        serialized = ItemsSerializer(obj)
        ownedObjs = serialized.data["owned_items"]
        owned = []
        for ownedObj in ownedObjs:
            owned.append(ownedObj["id"])

        return owned

    @classmethod
    def buy_item(cls, type, item_id, user: User):

        # check if new_item match the type
        item = cls.check_type(item_id, type)

        try:
            obj: Items = cls.objects.get(user=user, item_class=type)
        except cls.DoesNotExist:
            # create new items object (user, item_class,  owned_item, current_item)
            return cls.create_item(item, user, type)

        # add new items object (to owned_items)
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
