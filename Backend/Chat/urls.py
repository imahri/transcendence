from django.urls import path
from .views import ConversationView

urlpatterns = [
    path("conversations", ConversationView.as_view())
]
