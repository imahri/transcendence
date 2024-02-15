from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp
import qrcode
from core.settings import APP_NAME, SECRET_KEY, IMAGES_ROOT_


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
    # secret_code_2FA = models.CharField(max_length=50, blank=True)

    @staticmethod
    def create(data=None, **kwargs):
        """
        Create new User instance
        Enter data as dict
        Username and Email are required. Other fields are optional.
        """

        from User_Management.serializers import UserSerializer

        if data is None:
            data = {
                "username": kwargs.get("username"),
                "email": kwargs.get("email"),
                "first_name": kwargs.get("first_name"),
                "last_name": kwargs.get("last_name"),
                "password": kwargs.get("password"),
            }
        serializer = UserSerializer(data)
        serializer.save()
        return serializer.instance

    def get(self):
        """Get User field"""
        from User_Management.serializers import UserSerializer

        serializer = UserSerializer(self)
        return serializer.data

    def update(self, data: dict, return_updated_data=False):
        """Update User field except password ( use <obj>.set_password )"""

        User.objects.update(**data)
        return self.get() if return_updated_data is True else None

    def get_info(self):
        pass

    def get_friends(self):
        pass

    class TwoFactorAuth:
        from models import User

        @staticmethod
        def turn_on_2FA(user: User):
            uri = pyotp.totp.TOTP(SECRET_KEY).provisioning_uri(
                name=user.username, issuer_name=APP_NAME
            )
            otp_qrcode_path = f"{IMAGES_ROOT_}/{user.username}_totp.png"
            qrcode.make(uri).save(otp_qrcode_path)
            user.update(
                {"uri_2FA": uri, "qrcode_2FA": otp_qrcode_path, "is_2FA_active": True}
            )
            user.save()
            return otp_qrcode_path

        @staticmethod
        def turn_off_2FA(user: User):
            user.update({"uri_2FA": "", "qrcode_2FA": "", "is_2FA_active": False})
            user.save()

        @staticmethod
        def verify(user: User, code: str) -> bool:
            totp = pyotp.TOTP(SECRET_KEY)
            return totp.verify(code)


class Info(models.Model):
    """
    Store additional info about the User
    """

    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL)
    level = models.IntegerField(default=0)
    energy = models.IntegerField(default=10)
    wallet = models.IntegerField(default=0)

    GENDER = (("M", "Male"), ("F", "Female"))
    gender = models.CharField(max_length=1, choices=GENDER)
    profile_img = models.ImageField(upload_to=IMAGES_ROOT_, blank=True)
    banner_img = models.ImageField(upload_to=IMAGES_ROOT_, blank=True)
    grade_id = models.IntegerField(default=0)
    exp = models.IntegerField(default=0)


class Friend(models.Model):
    """
    Define the relation between two Users
    """

    Friendship = (("F", "friend"), ("B", "blocked"), ("I", "invited"))

    status = models.CharField(max_length=1, choices=Friendship)
    friend = models.OneToOneField(
        "User_Management.User", null=True, on_delete=models.SET_NULL
    )
    conversation = models.OneToOneField(
        "Chat.Conversation", null=True, on_delete=models.SET_NULL
    )
    user = models.ForeignKey(
        "User_Management.User",
        related_name="friends",
        null=True,
        on_delete=models.SET_NULL,
    )

    def is_friend(self):
        if self.status == "F":
            return True
        return False

    def is_blocked(self):
        if self.status == "B":
            return True
        return False
