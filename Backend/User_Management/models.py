from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp
import qrcode
from Backend.Game.serilaizers import EnemyMatchSerializer
from Game.models import Match
from core.settings import APP_NAME, IMAGES_ROOT, IMAGES_ROOT_
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from core.settings import DEFAULT_BANNER_IMG, DEFAULT_PROFILE_IMG
from django.db.models.manager import BaseManager


class User(AbstractUser):
    """
    Username and Email are required. Other fields are optional.
    """

    email = models.EmailField(unique=True)
    REQUIRED_FIELDS = ["email", "first_name", "last_name", "password"]
    # 2FA field
    is_2FA_active = models.BooleanField(default=False)
    uri_2FA = models.URLField(max_length=200, blank=True)
    qrcode_2FA = models.FilePathField(max_length=100, blank=True)
    secret_code_2FA = models.CharField(max_length=50, blank=True)

    @staticmethod
    def create(data=None, **kwargs):
        """
        Create new User instance
        Enter data as dict
        Username and Email are required. Other fields are optional.
        """

        from User_Management.serializers import UserSerializer

        valid_data: dict = {}
        if data is not None:
            valid_data = data
        else:
            for key, value in kwargs.items():
                valid_data[key] = value
        serializer = UserSerializer(data=valid_data)
        serializer.save()
        return serializer.instance

    def update(self, return_updated_data=False, **kwargs):
        """Update User field except password ( use <obj>.set_password )"""
        kwargs.pop("password", None)
        update_fields = []
        for key, value in kwargs.items():
            update_fields.append(key)
            setattr(self, key, value)
        self.save()
        return self.get() if return_updated_data is True else None

    @staticmethod
    def get_by_identifier(identifier: str):
        """
        Get user by username or email
        If the identifier is not found raise a ObjectDoesNotExist.
        """
        user = User.objects.filter(Q(username=identifier) | Q(email=identifier)).first()
        if user is None:
            raise ObjectDoesNotExist("user not found")
        return user

    def get(self, include_info=False):
        """Get User field"""
        from User_Management.serializers import UserSerializer

        serializer = UserSerializer(self)
        if include_info:
            return {**dict(serializer.data), **dict(self.get_info())}
        return serializer.data

    def set_info(self):
        Info.create(self)

    @property
    def info(self):
        return Info.objects.get(user=self)

    def get_info(self):
        """
        level, energy, wallet, gender, exp
        """
        from User_Management.serializers import InfoSerializer

        serializer = InfoSerializer(self.info)
        return serializer.data

    @property
    def friends(self) -> BaseManager:
        return self.friends_set.all()

    def get_friendship(self, friend):
        return Friend.objects.get(user=self, friend=friend)

    def last_match(self, With=None):
        if With:
            return Match.last_match_between(self, With)
        last_match = Match.objects.filter(user=self).order_by("-played_at").first()
        if not last_match:
            raise Exception("No matchs")
        return last_match

    def add_friend(self, friend):
        Friend.add_friend(self, friend)

    def accept_friend(self, friend):
        self.get_friendship(friend).accept()

    def block_friend(self, friend):
        self.get_friendship(friend).block()

    def deblock_friend(self, friend):
        self.get_friendship(friend).deblock()

    def delete_friend(self, friend):
        self.get_friendship(friend).conversation.delete()

    def get_new_Notification(self):
        return self.notifications.all().filter(is_hidden=False, is_read=False)

    def get_last_msg_notification(self):
        return self.notifications.all().filter(type="C", is_read=False)

    def get_all_notif(self):
        return Notification.objects.filter(user=self)

    class TwoFactorAuth:

        @staticmethod
        def turn_on_2FA(user):
            from django.utils.crypto import get_random_string

            secret_code_2FA = user.username  #! Hash this secret key
            uri = pyotp.totp.TOTP(secret_code_2FA).provisioning_uri(
                name=user.username, issuer_name=APP_NAME
            )
            otp_qrcode_path = f"{IMAGES_ROOT}/{user.username}_totp.png"
            qrcode.make(uri).save(otp_qrcode_path)
            user.uri_2FA = uri
            user.qrcode_2FA = otp_qrcode_path
            user.secret_code_2FA = secret_code_2FA
            user.is_2FA_active = True
            user.save()
            return otp_qrcode_path

        @staticmethod
        def turn_off_2FA(user):
            user.uri_2FA = ""
            user.qrcode_2FA = ""
            user.secret_code_2FA = ""
            user.is_2FA_active = False
            user.save()

        @staticmethod
        def verify(user, code: str) -> bool:
            totp = pyotp.TOTP(user.secret_code_2FA)
            return totp.verify(code)


class Info(models.Model):
    """
    Store additional info about the User
    """

    from Game.models import Grade

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    level = models.FloatField(default=1.5)
    energy = models.IntegerField(default=10)
    wallet = models.IntegerField(default=500)

    GENDER = (("M", "Male"), ("F", "Female"))
    gender = models.CharField(max_length=1, choices=GENDER, blank=True)
    profile_img = models.ImageField(
        upload_to=IMAGES_ROOT_, default=DEFAULT_PROFILE_IMG, blank=True
    )
    banner_img = models.ImageField(
        upload_to=IMAGES_ROOT_, default=DEFAULT_BANNER_IMG, blank=True
    )
    # grade_id = models.IntegerField(default=1)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, default=1)
    exp = models.IntegerField(default=0)

    @staticmethod
    def create(user: User):
        Info(user=user).save()


class Friend(models.Model):
    """
    Define the relation between two Users
    """

    Friendship = (
        ("F", "friend"),
        ("B", "blocked"),
        ("BY", "blocked you"),
        ("W", "wait_for_accept"),
        ("I", "invited"),
    )

    status = models.CharField(max_length=2, choices=Friendship)
    friend = models.ForeignKey(
        "User_Management.User", related_name="followers_set", on_delete=models.CASCADE
    )
    conversation = models.ForeignKey(
        "Chat.Conversation", related_name="friend_set", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        "User_Management.User", related_name="friends_set", on_delete=models.CASCADE
    )

    @staticmethod
    def add_friend(user: User, friend: User):
        from Chat.models import Conversation

        if user.friends.filter(friend=friend).first() is None:
            conversation = Conversation.create()
            Friend(
                user=user, friend=friend, conversation=conversation, status="W"
            ).save()
            Friend(
                user=friend, friend=user, conversation=conversation, status="I"
            ).save()
            conversation.owners.add(friend, user)
        else:
            raise Exception("Already Friend")

    def accept(self):
        if not self.is_invite:
            raise Exception("No invite")
        self.status = "F"
        self.save()
        friend_obj = self.friend.get_friendship(self.user)
        friend_obj.status = "F"
        friend_obj.save()

    def block(self):
        if self.is_block:
            raise Exception("Already Blocked")
        self.status = "B"
        self.save()
        friend_obj = self.friend.get_friendship(self.user)
        friend_obj.status = "BY"
        friend_obj.save()

    def deblock(self):
        if not self.status == "B":
            raise Exception("is not Blocked")
        self.status = "F"
        self.save()
        friend_obj = self.friend.get_friendship(self.user)
        friend_obj.status = "F"
        friend_obj.save()

    @property
    def is_invite(self):
        return self.status == "I"

    @property
    def is_friend(self):
        return self.status == "F"

    @property
    def is_block(self):
        return self.status == "B" or self.friend.get_friendship(self.user).status == "B"


class Notification(models.Model):

    NotifType = (
        ("C", "Chat"),
        ("F", "Friendship"),
        ("G", "Game"),
        ("T", "Tournament"),
    )

    user = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)
    sended_to = models.ManyToManyField(
        "User_Management.User", related_name="notifications"
    )
    type = models.CharField(choices=NotifType, max_length=20)
    time = models.DateTimeField(auto_now_add=True)
    content = models.JSONField()
    is_read = models.BooleanField(default=False)
    is_hidden = models.BooleanField(default=False)

    @staticmethod
    def create(user: User, content: dict):
        friend = User.get_by_identifier(content["to"])
        notification = Notification(user=user, type=content["type"])
        notification.content = content["content"]
        notification.save()
        notification.sended_to.add(friend)
        return notification

    @staticmethod
    def createToMultiUsers(user: User, content: dict):
        sended_to = content["to"]
        friends_ids = sended_to.values_list("id", flat=True)
        notification = Notification(user=user, type=content["type"])
        notification.content = content["content"]
        notification.save()
        notification.sended_to.add(*friends_ids)
        return notification

    def as_serialized(self):
        from .serializers import NotifSerializer

        return NotifSerializer(self).data

    @staticmethod
    def getNBUnreadedNotif(user: User):
        unreadedNotif = user.get_new_Notification()
        return len(unreadedNotif)

    @staticmethod
    def allNotifSerialised(user):
        from .serializers import NotifSerializer

        response = []
        allNotification = user.notifications.all().filter(is_hidden=False)

        if allNotification.exists():
            for notif in allNotification:
                notifData = dict(NotifSerializer(notif).data)
                response.append(notifData)

        return response

    @staticmethod
    def conversationAsRead(id, _notifications):
        notifications = _notifications.filter(type="C", is_read=False)
        for notification in notifications:
            if notification.content["conversationID"] == id:
                notification.is_read = True
                notification.save()
