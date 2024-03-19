from dataclasses import fields
import os
from pyexpat import model
from rest_framework.serializers import ModelSerializer

from core.settings import MEDIA_ROOT

from .models import Badge, Match, Board, Padel
from rest_framework import serializers
from User_Management.serializers import UserSerializer
from User_Management.models import User
import base64


class MatchSerializer(ModelSerializer):
    # accept mode as string and store it as int but it return it as string
    # accept enemy username and stor it with his pk
    # user is get from request and return it's username
    # but still does not stor the match enemy
    # we will figure out how to store it when implemnt the view

    mode = serializers.CharField()
    enemy = serializers.CharField()

    class Meta:
        model = Match
        fields = ("id", "enemy", "score", "played_at", "mode", "user", "enemy_match")

    def create(self, validated_data):
        validated_data["user"] = self.context["user"]
        mode_name = validated_data.pop("mode")
        validated_data["mode"] = Match.get_mode_name(mode_name)
        enemy_name = validated_data.pop("enemy")
        enemy = User.get_by_identifier(enemy_name)
        validated_data["enemy"] = enemy
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        key = int(data.pop("mode"))
        data["mode"] = Match.get_mode_value(key)
        user = User.objects.get(id=data.pop("user"))
        data["user"] = user.username
        enemy_user = User.get_by_identifier(data.pop("enemy"))
        enemy_serialised = UserSerializer(instance=enemy_user)
        data["enemy"] = enemy_serialised.data

        return data


class BadgeSerializer(ModelSerializer):

    class Meta:
        model = Badge
        fields = ("id", "color", "price", "image_path")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        image_path = (
            "http://localhost:8000/user/image?path=" + representation["image_path"]
        )
        representation["image"] = image_path
        del representation["image_path"]
        return representation


class BoardSerializer(ModelSerializer):

    class Meta:
        model = Board
        fields = ("id", "name", "price", "image_path")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        image_path = (
            "http://localhost:8000/user/image?path=" + representation["image_path"]
        )
        representation["image"] = image_path
        del representation["image_path"]
        return representation


class PadelSerializer(ModelSerializer):

    class Meta:
        model = Padel
        fields = ("id", "name", "definition", "price", "image_path")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        image_path = (
            "http://localhost:8000/user/image?path=" + representation["image_path"]
        )
        representation["image"] = image_path
        del representation["image_path"]
        return representation


# class BadgeSerializer(ModelSerializer):

#     class Meta:
#          model = Badge
#          fields = ('id', 'color', 'price', 'image_path')

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         image_path = MEDIA_ROOT + representation['image_path']

#         with open(image_path, "rb") as f:
#             image_data = base64.b64encode(f.read()).decode('utf-8')
#         representation['image'] =  f'data:image/png;base64,{image_data}'
#         del representation['image_path']
#         return representation
# class BoardSerializer(ModelSerializer):

#     class Meta:
#          model = Board
#          fields = ('id', 'name', 'price', 'image_path')

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         image_path = MEDIA_ROOT + representation['image_path']

#         with open(image_path, "rb") as f:
#             image_data = base64.b64encode(f.read()).decode('utf-8')
#         representation['image'] =  f'data:image/png;base64,{image_data}'
#         del representation['image_path']
#         return representation
# class PadelSerializer(ModelSerializer):

#     class Meta:
#          model = Padel
#          fields = ('id', 'name',  'definition' ,'price', 'image_path')


#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         image_path = MEDIA_ROOT + representation['image_path']

#         with open(image_path, "rb") as f:
#             image_data = base64.b64encode(f.read()).decode('utf-8')
#         representation['image'] =  f'data:image/png;base64,{image_data}'
#         del representation['image_path']
#         return representation
