from django.db import models


class Acheivement(models.Model):

    name = models.CharField(max_length=50)
    icon_path = models.ImageField(upload_to="static/images")
    users = models.ManyToManyField(
        'User_Management.User', related_name="acheivements")


class Match(models.Model):

    enemy = models.OneToOneField(
        'User_Management.User', null=True, on_delete=models.SET_NULL)
    score = models.IntegerField(default=0)
    enemy_match = models.OneToOneField(
        'Game.Match', null=True, on_delete=models.SET_NULL)
    played_at = models.TimeField(auto_now=True)

    MATCH_MODES = (
        (0, "Classic"),
        (1, "Ranked"),
        (2, "Tournement")
    )
    mode = models.IntegerField(choices=MATCH_MODES)
    user = models.ForeignKey(
        'User_Management.User', related_name="matches", null=True, on_delete=models.SET_NULL)


class Grade(models.Model):

    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to="images")


class Padel(models.Model):

    name = models.CharField(max_length=50)
    definition = models.TextField()
    # ability = None # !
    # special = None # !
    image_path = models.ImageField(upload_to="static/images")
    price = models.IntegerField()


class Badge(models.Model):

    color = models.CharField(max_length=7, default='#FF0000')
    image_path = models.ImageField(upload_to="static/images")
    price = models.IntegerField()


class Board(models.Model):

    image_path = models.ImageField(upload_to="static/images")
    price = models.IntegerField()
