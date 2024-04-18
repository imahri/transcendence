from django.urls import path
from .views import ConversationView, MessageView

urlpatterns = [
    path("conversations", ConversationView.as_view()),
    path("conversations/<str:friend_name>", ConversationView.get_conversation),
    path("conversations/last_message/<int:id>", ConversationView.get_last_message),
    path("messages", MessageView.as_view()),
]
