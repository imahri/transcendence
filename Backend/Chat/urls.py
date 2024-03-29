from django.urls import path
from .views import ConversationView, MessageView

urlpatterns = [
    path("conversations", ConversationView.as_view()),
    path("messages", MessageView.as_view()),
]
