from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from .models import Tournament

TOURNAMENT_PARTICIPANTS = 16


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
        """?all=True get all Conversation"""
        all: bool = bool(request.query_params.get("all", False))
        tournaments = (
            Tournament.objects.all().order_by("created_at")
            if all
            else Tournament.objects.filter(creator=request.user).order_by("created_at")
        )
        return Response([tournament.as_serialized() for tournament in tournaments])

    @staticmethod
    @api_view(["GET"])
    def get_by_name(request, name):
        """/<name>"""
        tournament = Tournament.objects.get(name=name)
        return Response(tournament.as_serialized())

    @catch_view_exception
    def delete(self, request: Request):
        """?id=<id>"""
        id = request.query_params.get("id")
        tournament = Tournament.objects.get(id=id)
        tournament.delete()
        return Response({"name": tournament.name})


@api_view(["GET"])
def StartTournament(request):
    id = request.GET.get("id")
    tournament = Tournament.objects.get(id=id)
    if (
        tournament.creator == request.user
        and len(tournament.participants) == TOURNAMENT_PARTICIPANTS
    ):
        pass
