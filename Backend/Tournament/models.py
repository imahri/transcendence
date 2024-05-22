from django.db import models
from User_Management.models import User
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from User_Management.Consumers.Notifconsumers import NotificationConsumer


class Tournament(models.Model):

    name = models.CharField(max_length=20, unique=True)
    creator = models.ForeignKey(
        "User_Management.User", null=True, on_delete=models.CASCADE
    )
    participants = models.ManyToManyField(
        "Tournament.Participant", related_name="tournaments"
    )
    match_index = models.IntegerField(default=0)
    schedule = models.JSONField(null=True)
    isEnd = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=True)

    def as_serialized(self):
        from .serializers import TournamentSerializer

        return TournamentSerializer(self).data

    @staticmethod
    def create(name: str, creator: User, creator_unique_name: str):
        tournament = Tournament(name=name, creator=creator)
        tournament.save()
        tournament.participants.add(
            Participant.objects.create(name=creator_unique_name, user=creator)
        )
        return tournament

    # CHECK IF ALREADY ADDED TO TOURNAMENT
    def join(self, user: User, unique_name: str):

        is_participant = self.participants.filter(user=user).exists()
        if is_participant:
            return False
        self.participants.add(Participant.objects.create(name=unique_name, user=user))
        return True

    def quit(self, unique_name: str):
        self.participants.remove(Participant.objects.get(name=unique_name))

    def make_schedule(self):
        participants = self.participants.values()
        self.schedule = {
            "FirstSide": {
                "3rd": {
                    "1": [participants[0], participants[4]],
                    "3": [participants[2], participants[6]],
                },
                "2nd": {"5": None},
                "1st": None,
            },
            "SecondSide": {
                "3rd": {
                    "2": [participants[1], participants[5]],
                    "4": [participants[3], participants[7]],
                },
                "2nd": {"6": None},
                "1st": None,
            },
        }
        self.save()
        return self

    def start_tournament_notif(self):
        channel_layer = get_channel_layer()
        uri: str = f"/tournament/{self.name}"
        message: str = f"Tournament {self.name} is Started"
        for participant in self.participants.all():
            user: User = participant.user
            channel_name = NotificationConsumer.get_channel_by_user(user.username)
            async_to_sync(channel_layer.send)(
                channel_name,
                {
                    "action": "send_notif",
                    "content": {
                        "to": user.username,
                        "type": "T",
                        "content": {
                            "uri": uri,
                            "message": message,
                        },
                    },
                },
            )
        return message


class Participant(models.Model):

    name = models.CharField(max_length=50)
    user = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)

    def as_serialized(self):
        from .serializers import ParticipantSerializer

        return ParticipantSerializer(self).data
