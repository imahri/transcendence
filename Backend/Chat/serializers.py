from rest_framework.serializers import ModelSerializer
from .models import Conversation, Message


class ConversationSerializer(ModelSerializer):
    class Meta:
        model = Conversation
        fields = [
            "id",
            "name",
            "image",
            "last_message",
            "unseen_msg",
        ]

    def to_representation(self, instance: Meta.model):
        return {
            "id": instance.pk,
            "name_arr": instance.name,
            "image_arr": instance.image,
            "last_message": instance.last_message,
            "unseen_msg": instance.unseen_msg,
        }


class MessageSerializer(ModelSerializer):

    class Meta:
        model = Message
        fields = ["id", "sender", "message", "sended_at"]
