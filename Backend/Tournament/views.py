from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Tournament


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
        tournament_name = request.data.get("tournament_name")
        alias_name = request.data.get("alias_name")
        tournament: Tournament = Tournament.create(
            tournament_name, request.user, alias_name
        )
        return Response(tournament.as_serialized())

    @catch_view_exception
    def get(self, request):
        pass

    @catch_view_exception
    def delete(self, request):
        pass
