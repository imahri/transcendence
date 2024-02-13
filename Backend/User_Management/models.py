from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
        Username and Email are required. Other fields are optional.
    """
    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = [
        "email",
        "first_name",
        "last_name",
        "password"
    ]


class Info(models.Model):
    """
        Store additional info about the User
    """

    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL)
    level = models.IntegerField(default=0)
    energy = models.IntegerField(default=10)
    wallet = models.IntegerField(default=0)

    GENDER = (
        ('M', 'Male'),
        ('F', 'Female')
    )
    gender = models.CharField(max_length=1, choices=GENDER)
    profile_img = models.ImageField(upload_to="static/images", blank=True)
    banner_img = models.ImageField(upload_to="static/images", blank=True)
    grade_id = models.IntegerField(default=0)
    exp = models.IntegerField(default=0)


class Friend(models.Model):
    """
        Define the relation between two Users
    """
    Friendship = (
        ('F', "friend"),
        ('B', "blocked"),
        ('I', "invited")
    )

    status = models.CharField(max_length=1, choices=Friendship)
    friend = models.OneToOneField(
        'User_Management.User', null=True, on_delete=models.SET_NULL)
    conversation = models.OneToOneField(
        'Chat.Conversation', null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(
        'User_Management.User', related_name="friends", null=True, on_delete=models.SET_NULL)

    def is_friend(self):
        if self.status == 'F':
            return True
        return False

    def is_blocked(self):
        if self.status == 'B':
            return True
        return False
