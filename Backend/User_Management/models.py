from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
        Username and Email and Password are required. Other fields are optional.

        Fields => [
            email,
            username = inherited,
            firstname = inherited,
            lastname = inherited,
            password = inherited,
            date_joined = inherited
        ]
    """
    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = [
        "email",
        "firstname",
        "lastname",
        "password"
    ]


class Info(models.Model):
    """
        Fields => [
            level,
            energy,
            wallet,
            gender,
            profile_img,
            banner_img,
            grade_id,
            user_id,
            padels,
            badges,
            boards,
            exp
        ]
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
    profile_img = models.ImageField(upload_to="./images", blank=True)
    banner_img = models.ImageField(upload_to="./images", blank=True)
    grade_id = models.IntegerField(default=0)
    exp = models.IntegerField(default=0)

    class Items(models.Field):
        ''' represent items that User have and current used item '''

        def __init__(self, item_class, *args, **kwargs):
            self.item_class = item_class
            self.current_item = kwargs.get("default")
            self.items = [self.current_item]
            super().__init__(*args, **kwargs)

        ''' get current_item object of the <item_class> object'''

        def get_current_item(self):
            return self.current_item

        ''' get items object of the <item_class> object'''

        def get_items(self):
            return self.items

    padels = Items('Game.Padel', default=0)
    badges = Items('Game.Badge', default=0)
    boards = Items('Game.Board', default=0)


class Friend(models.Model):
    """
        Fields => [
            friend_id,
            status,
            user_id,
            is_friend,
            is_blocked,
            conversation_id
        ]
    """
    class Friendship(models.TextChoices):
        FRIEND = ('F', "friend")
        BLOCKED = ('B', "blocked")
        INVITED = ('I', "invited")

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
