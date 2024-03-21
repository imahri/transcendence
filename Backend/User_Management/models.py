from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp
import qrcode
from Chat.models import Conversation
import requests as api_request
from core.settings import APP_NAME, IMAGES_ROOT, IMAGES_ROOT_
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from core.settings import DEFAULT_BANNER_IMG, DEFAULT_PROFILE_IMG


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
        serializer = UserSerializer(valid_data)
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
            raise ObjectDoesNotExist()
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

    def get_info(self):
        """
        level, energy, wallet, gender, exp
        """
        from User_Management.serializers import InfoSerializer

        serializer = InfoSerializer(Info.objects.get(user=self))
        return serializer.data

    def get_friends(self):
        pass

    def get_friend(self, friend_name):
        friend = User.get_by_identifier(friend_name)
        friendShip = Friend.objects.get(user=self, friend=friend)
        return friendShip

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

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    level = models.FloatField(default=0)
    energy = models.IntegerField(default=10)
    wallet = models.IntegerField(default=0)

    GENDER = (("M", "Male"), ("F", "Female"))
    gender = models.CharField(max_length=1, choices=GENDER, blank=True)
    profile_img = models.ImageField(
        upload_to=IMAGES_ROOT_, default=DEFAULT_PROFILE_IMG, blank=True
    )
    banner_img = models.ImageField(
        upload_to=IMAGES_ROOT_, default=DEFAULT_BANNER_IMG, blank=True
    )
    grade_id = models.IntegerField(default=0)
    exp = models.IntegerField(default=0)

    @staticmethod
    def create(user: User):
        Info(user=user).save()


class Friend(models.Model):
    """
    Define the relation between two Users
    """

    Friendship = (("F", "friend"), ("B", "blocked"), ("I", "invited"))

    status = models.CharField(max_length=1, choices=Friendship)
    friend = models.OneToOneField("User_Management.User", on_delete=models.CASCADE)
    conversation = models.OneToOneField("Chat.Conversation", on_delete=models.CASCADE)
    user = models.ForeignKey(
        "User_Management.User", related_name="friends", on_delete=models.CASCADE
    )

    @staticmethod
    def add_friend(user: User, friend: User):
        conversation = Conversation.create(type="D")
        friend_instance = Friend(
            user=user, friend=friend, conversation=conversation, status="I"
        )
        friend_instance.save()

    @staticmethod
    def accept(user: User, friend: User):
        pass
        # here
        # user.friends

    def block(self, friend: User):
        pass

    @staticmethod
    def getFriends(user: User):
        pass

    def is_friend(self):
        if self.status == "F":
            return True
        return False

    def is_blocked(self):
        if self.status == "B":
            return True
        return False
