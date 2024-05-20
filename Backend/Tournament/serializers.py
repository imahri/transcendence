from rest_framework.serializers import ModelSerializer
from .models import Tournament


class TournamentSerializer(ModelSerializer):
    class Meta:
        model = Tournament
        fields = ["name", "schedule", "isEnd", "created_at"]
