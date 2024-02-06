from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

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

    from .models import Info
    info = Info
    REQUIRED_FIELDS = ['username', 'email', 'password']

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
    level = models.FloatField()
    energy = models.IntegerField()
    wallet = models.IntegerField()

    class Gender(models.TextChoices):
        MALE = 'M', 'Male'
        FEMALE = 'F', 'Female'

    gender = models.CharField(max_length=1, choices=Gender)

    profile_img = models.ImageField(upload_to="./images")
    banner_img = models.ImageField(upload_to="./images")
    grade_id = models.IntegerField(default=0)
    user_id = models.IntegerField(default=0)
    padels = ArrayField(models.IntegerField(default=0), size=2)
    badges = ArrayField(models.IntegerField(default=0), size=2)
    boards = ArrayField(models.IntegerField(default=0), size=2)
    exp = models.IntegerField(default=0)
