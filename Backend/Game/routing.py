from django.urls import re_path
from .consumers import GameConsumer

ws_urlpatterns = [re_path("ws/game", GameConsumer.as_asgi())]