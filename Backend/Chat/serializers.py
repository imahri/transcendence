from rest_framework.serializers import ModelSerializer
from .models import Conversation

class ConversationSerializer(ModelSerializer):
    class Meta:
        model = Conversation
        fields = ['']


class MessageSerializer(ModelSerializer):
    pass
