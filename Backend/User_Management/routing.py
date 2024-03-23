from django.urls import re_path

from . import consumers

ws_urlpatterns = [
    re_path('ws/user', consumers.FriendShipConsumer.as_asgi()),
]