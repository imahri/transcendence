from django.urls import re_path

from .Consumers import Notifconsumers

ws_urlpatterns = [
    re_path("ws/notif", Notifconsumers.NotificationConsumer.as_asgi()),
]
