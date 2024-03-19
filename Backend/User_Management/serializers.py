from rest_framework.serializers import ModelSerializer
from .models import User, Info
from rest_framework import serializers


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        new_user = self.Meta.model(
            email=validated_data["email"],
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        new_user.set_password(validated_data["password"])
        new_user.save()
        new_user.set_info()
        return new_user

    def save(self, **kwargs):
        self.is_valid(raise_exception=True)
        return super().save(**kwargs)


class InfoSerializer(ModelSerializer):

    class Meta:
        model = Info
        fields = [
            "level",
            "energy",
            "wallet",
            "gender",
            "exp",
            "banner_img",
            "profile_img",
        ]

    def create(self, validated_data):
        user = validated_data["user"]
        user_info = self.Meta.model(user)
        user_info.save()
        return user_info

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation["profile_img"] is not None:
            profile_path = (
                "http://localhost:8000/user/image?path=" + representation["profile_img"]
            )
            representation["profile_img"] = profile_path
        if representation["banner_img"] is not None:
            banner_path = (
                "http://localhost:8000/user/image?path=" + representation["banner_img"]
            )
            representation["banner_img"] = banner_path
        return representation

        return data

    def save(self, **kwargs):
        self.is_valid(raise_exception=True)
        return super().save(**kwargs)
