from rest_framework.serializers import ModelSerializer
from .models import User, Info


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "first_name", "last_name", "password"]
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
        fields = ["level", "energy", "wallet", "gender", "exp"]

    def create(self, validated_data):
        user_info = self.Meta.model(validated_data)
        user_info.save()
        return user_info

    def save(self, **kwargs):
        self.is_valid(raise_exception=True)
        return super().save(**kwargs)
