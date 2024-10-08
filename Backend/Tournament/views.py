from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from User_Management.models import User
from .models import Tournament
from django.core.exceptions import ObjectDoesNotExist
from .serializers import TournamentSerializer


TOURNAMENT_PARTICIPANTS = 8


def catch_view_exception(func):

    def Wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except Exception as error:
            return Response(
                data={"error": str(error)}, status=status.HTTP_400_BAD_REQUEST
            )

    return Wrapper


class TournamentView(APIView):

    @catch_view_exception
    def post(self, request):
        """
        {
            tournament_name: <tournament_name>
            alias_name: <alias_name>
        }
        """
        tournament_name = request.data.get("tournament_name")
        alias_name = request.data.get("alias_name")
        tournament: Tournament = Tournament.create(
            tournament_name, request.user, alias_name
        )
        return Response(tournament.as_serialized())

    @catch_view_exception
    def get(self, request: Request):
        all: bool = bool(request.query_params.get("all", False))
        tournaments = (
            Tournament.objects.all().order_by("created_at")
            if all
            else Tournament.objects.filter(creator=request.user).order_by("created_at")
        )
        return Response([tournament.as_serialized() for tournament in tournaments])

    @catch_view_exception
    def put(self, request):
        # put methode to join a tournament
        """
        {
            tournament_id:
            alias_name:
        }
        """
        # first get Tournament and call join
        id: int = request.data.get("tournament_id")
        alias_name: str = request.data.get("alias_name")
        user = request.user

        tournament: Tournament = Tournament.objects.get(id=id)
        if tournament.participants.count() == 8:
            return Response(
                data="Tournament is Full", status=status.HTTP_400_BAD_REQUEST
            )
        if tournament.join(user=user, unique_name=alias_name) is False:
            return Response(
                data="User Arleady in Tournament", status=status.HTTP_400_BAD_REQUEST
            )

        return Response(tournament.as_serialized())

    @staticmethod
    @api_view(["GET"])
    def get_by_name(request, name):
        """getbyname/<name>"""
        tournament = Tournament.objects.get(name=name)
        return Response(tournament.as_serialized())

    @catch_view_exception
    def delete(self, request: Request):
        """?id=<id>"""
        id = request.query_params.get("id")
        tournament = Tournament.objects.get(id=id)
        tournament.delete()
        return Response({"name": tournament.name})


@api_view(["POST"])
def StartTournament(request):
    id = request.query_params.get("id")
    tournament = Tournament.objects.get(id=id)

    if tournament.creator != request.user:
        return Response({"error": "only for creator"}, status=status.HTTP_403_FORBIDDEN)
    if not tournament.participants.count() == TOURNAMENT_PARTICIPANTS:
        return Response(
            {"error": "need more participants"}, status=status.HTTP_403_FORBIDDEN
        )
    message = tournament.make_schedule().start_tournament_notif()
    tournament.next_match(True)
    tournament.isStarted = True
    tournament.save()
    return Response({"message": message})


@api_view(["GET"])
def searchTournamentView(request):
    try:
        search_text: str = request.query_params.get("search")
        founded_tournament = Tournament.objects.filter(name__icontains=search_text)
        if not founded_tournament.exists():
            raise ObjectDoesNotExist(f"No results found for {search_text}")

        tournament_serialized = TournamentSerializer(founded_tournament, many=True).data
        return Response(data=tournament_serialized)

    except ObjectDoesNotExist as no_found:
        return Response({"error": str(no_found)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)
