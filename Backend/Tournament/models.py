from django.db import models
from Game.models import Match
from User_Management.models import User, Notification
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
    schedule = models.JSONField(null=True, blank=True)
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
        #create notification for each user and send it
        content = {
            "type": "T",
            "to": self.participants.all(),
            "content": {
                "uri": uri,
                "message": message,
                "tournament_name": self.name,
            },
        }
        notification = Notification.createToMultiUsers(self.creator, content)
        data = notification.as_serialized()

        for participant in self.participants.all():
            user: User = participant.user
            try:
                channel_name = NotificationConsumer.get_channel_by_user(user.username)
                async_to_sync(channel_layer.send)(
                    channel_name,
                    {
                        'type': "redirect",
                        'content': data
                    },
                )
            except :
                pass
            return message

    def fill_2nd(self):
        if self.schedule == None:
            return
        match_index = self.match_index + 1
        if match_index == 5:
            self.schedule["FirstSide"]["2nd"]["5"] = [
                Match.get_winner(self.schedule["FirstSide"]["3rd"]["1"]),
                Match.get_winner(self.schedule["FirstSide"]["3rd"]["3"]),
            ]
        elif match_index == 6:
            self.schedule["SecondSide"]["2nd"]["6"] = [
                Match.get_winner(self.schedule["SecondSide"]["3rd"]["2"]),
                Match.get_winner(self.schedule["SecondSide"]["3rd"]["4"]),
            ]

    def next_match(self):
        if self.schedule == None:
            return
        self.match_index += 1
        # match self.match_index:
        #     case 1:
        #         return self.schedule["FirstSide"]["3rd"]["1"]
        #     case 2:
        #         return self.schedule["SecondSide"]["3rd"]["2"]
        #     case 3:
        #         return self.schedule["FirstSide"]["3rd"]["3"]
        #     case 4:
        #         return self.schedule["SecondSide"]["3rd"]["4"]
        #     case 5:
        #         return self.schedule["FirstSide"]["2nd"]["5"]
        #     case 6:
        #         return self.schedule["SecondSide"]["2nd"]["6"]
        #     case 7:
        #         return [
        #             self.schedule["FirstSide"]["1st"],
        #             self.schedule["SecondSide"]["1st"],
        #         ]
        if self.match_index == 1:
            return self.schedule["FirstSide"]["3rd"]["1"]
        elif self.match_index == 2:
            return self.schedule["SecondSide"]["3rd"]["2"]
        elif self.match_index == 3:
            return self.schedule["FirstSide"]["3rd"]["3"]
        elif self.match_index == 4:
            return self.schedule["SecondSide"]["3rd"]["4"]
        elif self.match_index == 5:
            return self.schedule["FirstSide"]["2nd"]["5"]
        elif self.match_index == 6:
            return self.schedule["SecondSide"]["2nd"]["6"]
        elif self.match_index == 7:
            return [
                self.schedule["FirstSide"]["1st"],
                self.schedule["SecondSide"]["1st"],
            ]
        self.save()


class Participant(models.Model):

    name = models.CharField(max_length=50)
    user = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)

    def as_serialized(self):
        from .serializers import ParticipantSerializer

        return ParticipantSerializer(self).data
