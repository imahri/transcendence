from django.urls import re_path

from .Consumers import Friendshipconsumers, Notifconsumers

ws_urlpatterns = [
    re_path('ws/user', Friendshipconsumers.FriendShipConsumer.as_asgi()),
    re_path('ws/notif', Notifconsumers.NotificationConsumer.as_asgi()),
]