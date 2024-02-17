from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp
import qrcode
from core.settings import APP_NAME, IMAGES_ROOT, IMAGES_ROOT_
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist


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

    def get(self):
        """Get User field"""
        from User_Management.serializers import UserSerializer

        serializer = UserSerializer(self)
        return serializer.data

    def update(self, return_updated_data=False, **kwargs):
        """Update User field except password ( use <obj>.set_password )"""
        kwargs.pop("password", None)
        update_fields = []
        for key, value in kwargs.items():
            update_fields.append(key)
            setattr(self, key, value)
        self.save()
        return self.get() if return_updated_data is True else None

    def get_info(self):
        pass

    def get_friends(self):
        pass

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
