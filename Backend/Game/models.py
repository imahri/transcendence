from django.db import models
from ..User_Management.models import User


class Acheivement(models.Model):

    name = models.CharField()
    icon_path = models.ImageField(upload_to="images")
    users = models.ManyToManyField(
        User, related_name="acheivements")


class Match(models.Model):
    from .models import Match  # !

    enemy = models.OneToOneField(User)
    score = models.IntegerField(default=0)
    enemy_match = models.OneToOneField(Match)
    played_at = models.TimeField(auto_now=True)

    MATCH_MODES = (
        ''' Note: Add Modes'''
        (0, "Classic"),
        (1, "Ranked"),
        (2, "Tournement")
    )
    mode = models.IntegerField(choices=MATCH_MODES)
    user = models.ForeignKey(User, related_name="matches")


class Grade(models.Model):

    name = models.CharField()
    image = models.ImageField(upload_to="images")


class Padel(models.Model):

    name = models.CharField()
    definition = models.TextField()
    # ability = None # !
    # special = None # !
    image_path = models.CharField()
    price = models.IntegerField()


class Badge(models.Model):

    color = models.CharField(max_length=7, default='#FF0000')
    image_path = models.CharField()
    price = models.IntegerField()


class Board(models.Model):

    image_path = models.CharField()
    price = models.IntegerField()
