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
            "last_message": instance.last_message,
        }


class MessageSerializer(ModelSerializer):

    class Meta:
        model = Message
        fields = ["id", "sender", "message", "sended_at"]
