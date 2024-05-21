from django.db import models
from User_Management.models import User


class Tournament(models.Model):

    name = models.CharField(max_length=20, unique=True)
    creator = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)
    participants = models.ManyToManyField(
        "Tournament.Participant", related_name="tournaments"
    )
    schedule = models.JSONField()
    isEnd = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=True)

    def as_serialized(self):
        from .serializers import TournamentSerializer
        return TournamentSerializer(self).data

    @staticmethod
    def create(name: str, creator: User, creator_unique_name: str):
        tournament = Tournament(name=name, schedule={})
        tournament.save()
        tournament.participants.add(
            Participant.objects.create(name=creator_unique_name, user=creator)
        )
        return tournament

    def join(self, user: User, unique_name: str):
        self.participants.add(Participant.objects.create(name=unique_name, user=user))

    def quit(self, unique_name: str):
        self.participants.remove(Participant.objects.get(name=unique_name))


class Participant(models.Model):

    name = models.CharField(max_length=50)
    user = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)

    def as_serialized(self):
        from .serializers import ParticipantSerializer
        
        return ParticipantSerializer(self).data
