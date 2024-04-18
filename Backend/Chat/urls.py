from django.urls import path
from .views import ConversationView, MessageView

urlpatterns = [
    path("conversations", ConversationView.as_view()),
    path("conversations/<str:friend_name>", ConversationView.get_conversation),
    path("messages", MessageView.as_view()),
]
