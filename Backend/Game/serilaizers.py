from dataclasses import fields
from rest_framework.serializers import ModelSerializer

from .models import Badge, Match, Board, Padel, Items, Acheivement
from rest_framework import serializers

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

    # def create(self, validated_data):
    #     validated_data["user"] = self.context["user"]
    #     mode_name = validated_data.pop("mode")
    #     validated_data["mode"] = Match.get_mode_name(mode_name)
    #     enemy_name = validated_data.pop("enemy")
    #     enemy = User.get_by_identifier(enemy_name)
    #     validated_data["enemy"] = enemy
    #     return super().create(validated_data)

    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     key = int(data.pop("mode"))
    #     data["mode"] = Match.get_mode_value(key)
    #     user = User.objects.get(id=data.pop("user"))
    #     data["user"] = user.username
    #     enemy_user = User.get_by_identifier(data.pop("enemy"))
    #     enemy_serialised = UserSerializer(instance=enemy_user)
    #     data["enemy"] = enemy_serialised.data
    #     return data

class GradeSerializer(ModelSerializer):


    class Meta:
        from .models import Grade
        model = Grade
        fields = ("id", "name", "image")
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        image_path = (
            "http://localhost:8000/user/image?path=" + representation["image"]
        )
        representation["image"] = image_path
        return representation



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

class ItemsSerializer(ModelSerializer):
    
    class Meta:
        model = Items
        fields = ("id", "item_class", "owned_items", "current_item", "user")
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        
    
        obj : Items = instance

        current_item = obj.SerializeItem(obj.current_item.id)    
        data['current_item'] = current_item.data
        
        owned_items = obj.Serialize_owned_items()
        data['owned_items'] = owned_items
        
        return data


class AcheivmentSerializer(ModelSerializer):

    class Meta:
        model = Acheivement
        fields = ("id", "name", "icon_path")

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        image_path = (
            "http://localhost:8000/user/image?path=" + representation["icon_path"]
        )
        representation["icon_path"] = image_path
        return representation
