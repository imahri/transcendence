from django.urls import path
from .views import StartTournament, TournamentView

urlpatterns = [
    path("", TournamentView.as_view(), name="tournament"),
    path("<str:name>", TournamentView.get_by_name, name="tournament_by_name"),
    path("StartTournament", StartTournament, name="start_tournament"),
]
