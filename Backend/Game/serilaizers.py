from dataclasses import fields
from rest_framework.serializers import ModelSerializer

from .models import Badge, Match, Board, Padel, Items, Acheivement
from rest_framework import serializers
from User_Management.serializers import UserSerializer

class EnemyMatchSerializer(ModelSerializer):

    class Meta:
        model = Match
        fields = ("id", "score")

class MatchSerializer(ModelSerializer):

    enemy = UserSerializer()
    enemy_match = EnemyMatchSerializer()
    mode_display = serializers.CharField(source="get_mode_display", read_only=True)

    class Meta:
        model = Match
        fields = ("id", "enemy", "score", "played_at", "mode", "mode_display",  "user", "enemy_match")


class GradeSerializer(ModelSerializer):


    class Meta:
        from .models import Grade
        model = Grade
        fields = ("id", "name", "image")


class BadgeSerializer(ModelSerializer):

    class Meta:
        model = Badge
        fields = ("id", "color", "price", "image_path")


class BoardSerializer(ModelSerializer):

    class Meta:
        model = Board
        fields = ("id", "name", "price", "image_path")


class PadelSerializer(ModelSerializer):

    class Meta:
        model = Padel
        fields = ("id", "name", "definition", "price", "image_path")

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
