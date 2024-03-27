from rest_framework.serializers import ModelSerializer
from .models import Conversation, Message


class ConversationSerializer(ModelSerializer):
    class Meta:
        model = Conversation
        fields = [
            "id",
            "type",
            "name",
            "image",
            "last_message",
            "unseen_msg",
        ]


class MessageSerializer(ModelSerializer):

    class Meta:
        model = Message
        fields = ["id", "sender", "message", "sended_at"]