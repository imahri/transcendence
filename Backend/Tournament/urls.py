from django.urls import path
from .views import StartTournament, TournamentView, searchTournamentView

urlpatterns = [
    path("", TournamentView.as_view(), name="tournament"),
    path("StartTournament", StartTournament, name="start_tournament"),
    path("search", searchTournamentView, name="search_tournament"),
    path("getbyname/<str:name>", TournamentView.get_by_name, name="tournament_by_name"),
]
