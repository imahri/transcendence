from django.urls import re_path
from .consumers import GameConsumer, TournamentConsumer, PrivegameConsumer

ws_urlpatterns = [
            re_path("ws/game", GameConsumer.as_asgi()),
            re_path("ws/tournament", TournamentConsumer.as_asgi()),      
            re_path("ws/privegame", PrivegameConsumer.as_asgi()),
        ]