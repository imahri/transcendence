import random
from django.db import models
from Game.consumers import TournamentConsumer
from Game.models import Match
from User_Management.models import User, Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from User_Management.Consumers.Notifconsumers import NotificationConsumer


class Tournament(models.Model):

    name = models.CharField(max_length=20, unique=True)
    creator = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)
    winner = models.ForeignKey(
        "Tournament.Participant", on_delete=models.CASCADE, blank=True, null=True
    )
    participants = models.ManyToManyField(
        "Tournament.Participant", related_name="tournaments"
    )
    match_index = models.IntegerField(default=0)
    schedule = models.JSONField(default=dict)
    isStarted = models.BooleanField(default=False)
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

    def join(self, user: User, unique_name: str):

        is_participant = self.participants.filter(user=user).exists()
        if is_participant:
            return False
        is_participant = self.participants.filter(name=unique_name).exists()
        if is_participant:
            return False
        self.participants.add(Participant.objects.create(name=unique_name, user=user))
        return True

    def is_participant(self, user: User):
        return self.participants.filter(user=user).exists()

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
        # create notification for each user and send it
        players_id = self.participants.values_list("user", flat=True)
        players = User.objects.filter(pk__in=players_id)
        content = {
            "type": "T",
            "to": players,
            "content": {
                "uri": uri,
                "message": message,
                "tournament_name": self.name,
            },
        }
        notification = Notification.createToMultiUsers(self.creator, content)
        data = notification.as_serialized()

        for user in players:
            try:
                channel_name = NotificationConsumer.get_channel_by_user(user.username)
                async_to_sync(channel_layer.send)(
                    channel_name,
                    {"type": "redirect", "content": data},
                )
            except:
                pass
        return message

    def create_match(self, user: User, enemy: User):
        return Match.create(user, enemy, 2, self)

    def get_winner(self, players: list[dict]):
        [player1, player2] = players
        user1 = User.objects.get(id=player1["user_id"])
        user2 = User.objects.get(id=player2["user_id"])
        match = (
            Match.objects.filter(user=user1, enemy=user2, tournament=self)
            .order_by("-played_at")
            .first()
        )
        if not match:
            raise Exception("No match found")
        return player1 if match.is_winner else player2

    def fill_2nd(self):
        if self.schedule == None:
            return
        self.schedule["FirstSide"]["2nd"]["5"] = [
            self.get_winner(self.schedule["FirstSide"]["3rd"]["1"]),
            self.get_winner(self.schedule["FirstSide"]["3rd"]["3"]),
        ]
        self.schedule["SecondSide"]["2nd"]["6"] = [
            self.get_winner(self.schedule["SecondSide"]["3rd"]["2"]),
            self.get_winner(self.schedule["SecondSide"]["3rd"]["4"]),
        ]
        self.save()

    def fill_1nd(self):
        if self.schedule == None:
            return
        self.schedule["FirstSide"]["1st"] = self.get_winner(
            self.schedule["FirstSide"]["2nd"]["5"]
        )
        self.schedule["SecondSide"]["1st"] = self.get_winner(
            self.schedule["SecondSide"]["2nd"]["6"]
        )
        self.save()

    def next_match(self, start=False):
        if self.schedule == None:
            return
        next_players: list[dict]
        channel_layer = get_channel_layer()

        if start == False:
            if self.match_index == 1:
                next_players = self.schedule["FirstSide"]["3rd"]["1"]
            elif self.match_index == 2:
                next_players = self.schedule["SecondSide"]["3rd"]["2"]
            elif self.match_index == 3:
                next_players = self.schedule["FirstSide"]["3rd"]["3"]
            elif self.match_index == 4:
                next_players = self.schedule["SecondSide"]["3rd"]["4"]
            elif self.match_index == 5:
                next_players = self.schedule["FirstSide"]["2nd"]["5"]
            elif self.match_index == 6:
                next_players = self.schedule["SecondSide"]["2nd"]["6"]
            elif self.match_index == 7:
                next_players = [
                    self.schedule["FirstSide"]["1st"],
                    self.schedule["SecondSide"]["1st"],
                ]
            winner: dict = self.get_winner(next_players)
            players_id = self.participants.values_list("user", flat=True)
            content = {
                "type": "T",
                "to": User.objects.filter(pk__in=players_id),
                "content": {
                    "type": "winner",
                    "message": f"{self.participants.get(pk=winner['id']).user.username} win his match in {self.name}",
                    "tournament_name": self.name,
                },
            }
            notification = Notification.createToMultiUsers(self.creator, content)
            data = notification.as_serialized()

            for participant in self.participants.all():
                user: User = participant.user
                try:
                    channel_name = NotificationConsumer.get_channel_by_user(
                        user.username
                    )
                    async_to_sync(channel_layer.send)(
                        channel_name,
                        {"type": "redirect", "content": data},
                    )
                except:
                    pass

        self.match_index += 1
        self.save()
        if self.match_index == 1:
            next_players = self.schedule["FirstSide"]["3rd"]["1"]
        elif self.match_index == 2:
            next_players = self.schedule["SecondSide"]["3rd"]["2"]
        elif self.match_index == 3:
            next_players = self.schedule["FirstSide"]["3rd"]["3"]
        elif self.match_index == 4:
            next_players = self.schedule["SecondSide"]["3rd"]["4"]
        elif self.match_index == 5:
            self.fill_2nd()
            next_players = self.schedule["FirstSide"]["2nd"]["5"]
        elif self.match_index == 6:
            next_players = self.schedule["SecondSide"]["2nd"]["6"]
        elif self.match_index == 7:
            self.fill_1nd()
            next_players = [
                self.schedule["FirstSide"]["1st"],
                self.schedule["SecondSide"]["1st"],
            ]
        elif self.match_index == 8:
            self.isEnd = True
            self.winner = self.participants.get(id=winner["id"])
            winner_user = User.objects.get(pk=winner["user_id"])
            winner_user.info.tournament_win += 1
            winner_user.info.wallet += 500
            winner_user.info.save()
            self.save()
            return
        players = [
            self.participants.get(id=next_players[0]["id"]),
            self.participants.get(id=next_players[1]["id"]),
        ]
        room_name: str = f"room_{random.randint(1000, 99999999)}"
        players_name = [players[0].user.username, players[1].user.username]
        TournamentConsumer.game_room.append([room_name, players_name])
        notification = Notification.createToMultiUsers(
            self.creator,
            content={
                "type": "T",
                "to": User.objects.filter(
                    pk__in=[
                        players[0].user.pk,
                        players[1].user.pk,
                    ]
                ),
                "content": {
                    "type": "match",
                    "room_name": room_name,
                    players_name[0]: players_name[1],
                    players_name[1]: players_name[0],
                    "tournament_name": self.name,
                },
            },
        )
        data = notification.as_serialized()
        for username in players_name:
            try:
                channel_name = NotificationConsumer.get_channel_by_user(username)
                async_to_sync(channel_layer.send)(
                    channel_name,
                    {"type": "redirect", "content": data},
                )
            except:
                pass

    def getPlayerByName(self, arrNames):
        user1 = self.participants.get(name=arrNames[0])
        user2 = self.participants.get(name=arrNames[1])
        return [user1, user2]


class Participant(models.Model):

    name = models.CharField(max_length=50)
    user = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)

    def as_serialized(self):
        from .serializers import ParticipantSerializer

        return ParticipantSerializer(self).data
