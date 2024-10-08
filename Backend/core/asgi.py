"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import django

django.setup()

import os

from django.core.asgi import get_asgi_application

# from Backend import Game
from channels.routing import ProtocolTypeRouter, URLRouter
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import Chat.ws_urls
import User_Management.routing
import Game.routing

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JWTAuthMiddlewareStack(
            URLRouter(
                Chat.ws_urls.ws_urlpatterns
                + User_Management.routing.ws_urlpatterns
                + Game.routing.ws_urlpatterns
            )
        ),
    }
)
