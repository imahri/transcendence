from itertools import chain
from pyexpat import model
from django.db import models
from core.settings import IMAGES_ROOT_


class Acheivement(models.Model):

    name = models.CharField(max_length=50)
    icon_path = models.ImageField(upload_to=IMAGES_ROOT_)
    users = models.ManyToManyField("User_Management.User", related_name="acheivements")


class Match(models.Model):

    enemy = models.OneToOneField(
        "User_Management.User", null=True, on_delete=models.SET_NULL
    )
    score = models.IntegerField(default=0)
    enemy_match = models.OneToOneField(
        "Game.Match", null=True, on_delete=models.SET_NULL
    )
    played_at = models.TimeField(auto_now=True)

    MATCH_MODES = ((0, "Classic"), (1, "Ranked"), (2, "Tournement"))
    mode = models.IntegerField(choices=MATCH_MODES)
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

    user = models.OneToOneField(
        "User_Management.User",
        related_name="items",
        null=True,
        on_delete=models.SET_NULL,
    )
    item_class = models.CharField(max_length=10, choices=ITEM_TYPES)
    owned_items = models.ManyToManyField("Game.Item", related_name="owned_by")
    current_item = models.OneToOneField(
        "Game.Item", on_delete=models.SET_NULL, null=True, related_name="in_use"
    )

    # ''' get current_item object of the <item_class> object'''

    # def get_current_item(self):
    #     return self.current_item

    # ''' get items object of the <item_class> object'''

    # def get_items(self):
    #     return self.items


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
