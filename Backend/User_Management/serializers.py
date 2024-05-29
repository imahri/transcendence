from re import L
from attr import fields
from rest_framework.serializers import ModelSerializer
from .models import User, Info, Notification
from rest_framework import serializers

class UserSerializer(ModelSerializer):

    img = serializers.SerializerMethodField();

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
            "img",
            "is_2FA_active",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        new_user = self.Meta.model(
            email=validated_data.get("email", ""),
            username=validated_data["username"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        new_user.set_password(validated_data["password"])
        new_user.save()
        new_user.set_info()
        return new_user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        
        # Check if password is provided before updating
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


    def get_img(self, obj):
        return obj.get_info()['profile_img']


class InfoSerializer(ModelSerializer):
    
    from Game.serilaizers import GradeSerializer

    grade = GradeSerializer()
    nb_game = serializers.SerializerMethodField()

    class Meta:
        model = Info
        fields = [
            "level",
            "energy",
            "wallet",
            "exp",
            "profile_img",
            "grade",
            "nb_game",
        ]

    def get_nb_game(self, obj: Info):
        return len(obj.user.matches.all())
    
    def create(self, validated_data):
        user = validated_data["user"]
        user_info = self.Meta.model(user)
        user_info.save()
        return user_info

    def save(self, **kwargs):
        self.is_valid(raise_exception=True)
        return super().save(**kwargs)


class NotifSerializer(ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Notification
        fields = ["id", "user", "type", "time", "content", "is_read"]