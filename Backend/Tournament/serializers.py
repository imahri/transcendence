from rest_framework.serializers import ModelSerializer
from .models import Participant, Tournament
from User_Management.serializers import UserSerializer


class ParticipantSerializer(ModelSerializer):

    user = UserSerializer()

    class Meta:
        model = Participant
        fields = ["name", "user"]

class TournamentSerializer(ModelSerializer):
    
    creator = UserSerializer()
    participants = ParticipantSerializer(many=True)

    class Meta:
        model = Tournament
        fields = ["id", "name", "schedule", "isEnd", "created_at", "creator", "participants"]
