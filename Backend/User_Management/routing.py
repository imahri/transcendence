from django.urls import re_path

from .Consumers import Friendshipconsumers

ws_urlpatterns = [
    re_path('ws/user', Friendshipconsumers.FriendShipConsumer.as_asgi()),
    re_path('ws/notif', Friendshipconsumers.NotificationConsumer.as_asgi()),
]