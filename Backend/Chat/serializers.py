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

    def to_representation(self, instance: Meta.model):
        # need test and find right name & image (in friend case) to send
        data = super().to_representation(instance)
        return data


class MessageSerializer(ModelSerializer):
    pass
