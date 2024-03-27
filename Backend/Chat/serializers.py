from rest_framework.serializers import ModelSerializer
from .models import Conversation


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
    pass
