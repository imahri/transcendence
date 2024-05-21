from rest_framework.serializers import ModelSerializer
from .models import Participant, Tournament


class TournamentSerializer(ModelSerializer):
    class Meta:
        model = Tournament
        fields = ["name", "schedule", "isEnd", "created_at"]


class ParticipantSerializer(ModelSerializer):
    class Meta:
        model = Participant
        fields = ["name", "schedule", "isEnd", "created_at"]
