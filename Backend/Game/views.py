import random
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from Game.consumers import GameConsumer, TournamentConsumer
from .serilaizers import (
    BadgeSerializer,
    PadelSerializer,
    BoardSerializer,
    ItemsSerializer,
    AcheivmentSerializer,
)
from .models import Badge, Board, Match, Padel, Items, Acheivement
from User_Management.models import Info, User
from User_Management.serializers import InfoSerializer, UserSerializer


def catch_view_exception(func):

    def Wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except Exception as error:
            return Response(
                data={"error": str(error)}, status=status.HTTP_400_BAD_REQUEST
            )

    return Wrapper


class RoomView(APIView):

    @staticmethod
    def is_exiting(room_name: str, Consumer):
        for _room in Consumer.game_room:
            if _room[0] == room_name:
                return _room[1]
        return None

    @catch_view_exception
    def post(self, request):
        user: User = request.user
        username = request.query_params.get("username", None)
        if not username:
            return Response({"error": "username of frined required"})
        friend: User = User.objects.get(username=username)
        is_Friend = user.friends.filter(friend=friend).exists()
        if not is_Friend:
            return Response({"error": "Not Friend"}, status=400)

        room_name: str = f"room_private_{random.randint(1000, 99999999)}"
        GameConsumer.game_room.append([room_name, [user.username, username]])

        Match.send_accept_play(user, friend, room_name=room_name)

        return Response({"room_name": room_name})

    @catch_view_exception
    def get(self, request):
        user: User = request.user
        room_name = request.query_params.get("room", None)
        is_tournament = request.query_params.get("tournament", "false")
        if not room_name:
            return Response({"error": "room name required"})
        room = RoomView.is_exiting(room_name, TournamentConsumer if is_tournament is "true" else GameConsumer)
        if not room:
            return Response(
                {"error": "Room Does Not Exist"}, status=status.HTTP_404_NOT_FOUND
            )
        if not user.username in room:
            return Response(
                {"error": "User Not in the room"}, status=status.HTTP_400_BAD_REQUEST
            )

        friend: User
        username = room[0] if room[1] == user.username else room[1]
        friend = User.objects.get(username=username)
        if is_tournament == "false":
            if not user.friends.filter(friend=friend).exists():
                return Response(
                    {"error": "Not Friend"}, status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            {
                "player1": {
                    "name": friend.username,
                    "image": friend.info.profile_img.url,
                    "exp": friend.info.exp,
                },
                "player2": {
                    "name": user.username,
                    "image": user.info.profile_img.url,
                    "exp": user.info.exp,
                },
            }
        )


class MatchView(APIView):

    def get(self, request):
        try:
            # check if user blocked
            owner: User = request.user
            username = request.query_params.get("username")
            user: User = User.objects.get(username=username)
            if owner.friend_is_blocked(user):
                return Response({"error": "this user is blocked"}, status=400)
            last_match = Match.getLstMatch(user)
            winning = 0
            loses = 0
            allMatches = Match.getAllMatches(user)
            played = len(allMatches)
            if allMatches == []:
                allMatches = ""
            if played != 0:
                winning = Match.getWinning(user)
                loses = Match.getLoses(user)

            return Response(
                {
                    "all": allMatches,
                    "last_match": last_match,
                    "played": played,
                    "winning": winning,
                    "loses": loses,
                }
            )
        except Exception as error:
            return Response({"error": str(error)}, status=400)


class BadgeView(APIView):

    def get(self, request):

        try:
            objects = Badge.objects.all()
            serializer = BadgeSerializer(instance=objects, many=True)
            owned = []
            try:
                obj: Items = Items.objects.get(user=request.user, item_class="badges")
                data = ItemsSerializer(obj).data
                ownedObjs = data["owned_items"]
                for ownedObj in ownedObjs:
                    owned.append(ownedObj["id"])
            except Items.DoesNotExist:
                pass

            return Response({"badges": serializer.data, "owned": owned})
        except Exception as error:
            return Response({"error": str(error)}, status=400)


class BoardView(APIView):

    def get(self, request):

        try:
            objects = Board.objects.all()
            serializer = BoardSerializer(instance=objects, many=True)
            owned = []
            try:
                obj: Items = Items.objects.get(user=request.user, item_class="boards")
                data = ItemsSerializer(obj).data
                ownedObjs = data["owned_items"]
                for ownedObj in ownedObjs:
                    owned.append(ownedObj["id"])
            except Items.DoesNotExist:
                pass

            return Response({"boards": serializer.data, "owned": owned})

        except Exception as error:
            return Response({"error": str(error)}, status=400)


class PadleView(APIView):

    def get(self, request):

        try:
            objects = Padel.objects.all()
            serializer = PadelSerializer(instance=objects, many=True)
            # get owned paddles ids
            owned = []
            try:
                obj: Items = Items.objects.get(user=request.user, item_class="padels")
                data = ItemsSerializer(obj).data
                ownedObjs = data["owned_items"]
                for ownedObj in ownedObjs:
                    owned.append(ownedObj["id"])
            except Items.DoesNotExist:
                pass

            return Response({"paddles": serializer.data, "owned": owned})

        except Exception as error:
            return Response({"error": str(error)}, status=400)


class ItemsView(APIView):

    def get(self, request):
        # get user items you should pass username in query
        try:
            owner: User = request.user
            username = request.query_params.get("username")
            user: User = User.objects.get(username=username)
            if owner.friend_is_blocked(user):
                return Response({"error": "this user is blocked"}, status=400)
            objs = Items.objects.filter(user=user)
            response = {"padels": "", "badges": "", "boards": ""}
            for obj in objs:
                ItemsSerialized = ItemsSerializer(instance=obj).data
                type = ItemsSerialized["item_class"]
                response[type] = ItemsSerialized

            return Response(response)

        except Exception as error:
            print("catch : ", error)
            return Response(data=str(error), status=400)

    def put(self, request):
        # this view can equip item or add owned item and return the updated items
        try:

            action = request.data.get("action")
            new_item = request.data.get("item_id")
            response = ""

            if action == "equip":
                items_id = request.data.get("items_id")
                obj: Items = Items.objects.get(id=items_id, user=request.user)
                response = obj.equip_item(new_item)

            if action == "buy":
                item_type = request.data.get("item_type")

                response = Items.buy_item(item_type, new_item, request.user)

            return Response(data=response)

        except Exception as error:
            print("catch : ", error)
            return Response(data=str(error), status=400)


class AcheivmentView(APIView):
    # get acheivment of a specific user pass user name to get it
    def get(self, request):

        owner: User = request.user
        username = request.query_params.get("username")
        user: User = User.objects.get(username=username)
        if owner.friend_is_blocked(user):
            return Response({"error": "this user is blocked"}, status=400)

        all_acheivements = Acheivement.objects.all()
        unlocked_acheivements = user.acheivements.all()

        acheivements_data = AcheivmentSerializer(
            instance=all_acheivements, many=True
        ).data

        for achievement in acheivements_data:
            if unlocked_acheivements.filter(id=achievement.get("id")).exists():
                achievement["unlocked"] = True
            else:
                achievement["unlocked"] = False

        return Response(data=acheivements_data)


@api_view(["GET"])
def get_rank(request):
    users_info = Info.objects.all().order_by("-exp")
    res = []
    for info in users_info:
        data = dict(UserSerializer(info.user).data)
        info_data = dict(InfoSerializer(info).data)
        data["grade_img"] = info_data["grade"]["image"]
        data["level"] = info_data["level"]
        data["exp"] = info_data["exp"]
        res.append(data)
    return Response(res)


@api_view(["GET"])
def get_equiped_item(request):
    # get user items you should pass username in query
    try:
        username = request.query_params.get("username")
        type = request.query_params.get("type")
        user: User = User.objects.get(username=username)
        items = Items.objects.get(user=user, item_class=type)
        obj = Items.check_type(items.current_item.id, type)
        ItemSerialized: dict
        if type == "badges":
            ItemSerialized = BadgeSerializer(obj).data
        elif type == "boards":
            ItemSerialized = BoardSerializer(obj).data
        return Response(ItemSerialized)

    except Exception as error:
        return Response(data=str(error), status=400)


@api_view(["GET"])
def check_achievement(request):
    isAdded = False
    try:
        user: User = request.user
        if not Acheivement.owner_of(user, "The Ghost"):
            if len(Match.objects.filter(user=user, score=5)) == 20:
                Acheivement.objects.get(name="The Ghost").users.add(user)
                isAdded = True
        if not Acheivement.owner_of(user, "The Killer"):
            if len(Match.objects.filter(user=user, score=5)) == 15:
                Acheivement.objects.get(name="The Killer").users.add(user)
                isAdded = True
        if not Acheivement.owner_of(user, "The Death"):
            if len(Match.objects.filter(user=user, score=5)) == 10:
                Acheivement.objects.get(name="The Death").users.add(user)
                isAdded = True
        if not Acheivement.owner_of(user, "Fiddler"):  # ! Create use with the same name
            if Match.objects.filter(
                user=user, enemy=User.objects.get(username="Fiddler")
            ).exists():
                Acheivement.objects.get(name="Fiddler").users.add(user)
                isAdded = True
        if not Acheivement.owner_of(user, "SUDO"):
            if user.is_staff:
                Acheivement.objects.get(name="SUDO").users.add(user)
                isAdded = True
    except:
        pass
    return Response({"state": "added"}) if isAdded else Response({"state": "not added"}, status=status.HTTP_204_NO_CONTENT)