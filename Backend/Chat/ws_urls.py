from django.urls import re_path
from .consumers import ChatConsumer

ws_urlpatterns = [re_path("ws/chat", ChatConsumer.as_asgi())]
