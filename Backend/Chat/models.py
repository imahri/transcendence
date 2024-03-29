from rest_framework.utils.serializer_helpers import ReturnDict
from django.db import models
from django.db.models.manager import BaseManager
from User_Management.models import User, Friend
from core.settings import IMAGES_ROOT_
from django.core.exceptions import ObjectDoesNotExist


class Conversation(models.Model):

    EmptyConversation = "Wed May 22 2004 00:00:00 GMT+0000 (GMT)"

    @staticmethod
    def create():
        instance = Conversation()
        instance.save()
        return instance

    @property
    def messages(self):
        return Message.objects.filter(conversation=self)

    @property
    def last_message(self):
        message = self.messages.order_by("-sended_at").first()
        if message is None:
            return None
        return {"sended_at": message.sended_at, "message": message.message}

    @property
    def friends(self) -> BaseManager[Friend]:
        return self.friends_set

    @property
    def last_msg_time(self):
        return (
            self.last_message["sended_at"]
            if self.last_message is not None
            else Conversation.EmptyConversation
        )

    @property
    def name(self):
        return [
            self.friends[0].user.username,
            self.friends[1].user.username,
        ]

    @property
    def image(self):
        return [
            self.friends[0].user.info.profile_img,
            self.friends[1].user.info.profile_img,
        ]

    @property
    def unseen_msg(self):
        """Currently"""
        return 0

    def as_serialized(self, user: User):
        from .serializers import ConversationSerializer

        def opts_v(arr, value):
            return arr[1] if arr[0] == value else arr[0]

        data = dict(ConversationSerializer(self).data)
        data["name"] = opts_v(data.pop("name"), user.username)
        data["image"] = opts_v(data.pop("image"), user.info.profile_img)
        return ReturnDict(data)


class Message(models.Model):

    sender = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)
    message = models.TextField(max_length=100)
    sended_at = models.TimeField(auto_now=True)
    conversation = models.ForeignKey(
        Conversation, related_name="messages", on_delete=models.CASCADE
    )

    def as_serialized(self, user: User):
        from .serializers import MessageSerializer

        data = dict(MessageSerializer(self).data)
        data["type"] = "sent" if data["sender"] == user.username else "received"
        return ReturnDict(data)
