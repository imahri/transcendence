from rest_framework.utils.serializer_helpers import ReturnDict
from django.db import models
from django.db.models.manager import BaseManager
from User_Management.models import User, Friend
from core.settings import IMAGES_ROOT_
from django.core.exceptions import ObjectDoesNotExist


class Conversation(models.Model):

    EmptyConversation = "Wed May 22 2004 00:00:00 GMT+0000 (GMT)"
    owners = models.ManyToManyField("User_Management.User")
    last_modified = models.DateTimeField(auto_now=True)

    @staticmethod
    def create():
        instance = Conversation()
        instance.save()
        return instance

    @property
    def last_message(self):
        message = self.messages.order_by("-sended_at").first()
        if message is None:
            return None
        return {"sended_at": str(message.sended_at), "message": message.message}

    @property
    def friends(self) -> BaseManager[Friend]:
        return self.friend_set

    @property
    def check_is_friend(self):
        friends = self.friends.all()
        for friend in friends:
            if not friend.is_friend:
                return False
        return True

    def friend(self, user: User):
        return (
            self.friends.first().friend
            if self.friends.first().user.pk == user.pk
            else self.friends.first().user
        )

    def unseen_msg(self, user):
        allNotification = user.notifications.all().filter(
            type="C", is_read=False, is_hidden=False
        )
        counter = 0
        for Notification in allNotification:
            if self.pk == Notification.content["conversationID"]:
                counter += 1
        return counter

    def as_serialized(self, user: User):
        from .serializers import ConversationSerializer

        data = dict(ConversationSerializer(self).data)
        data["name"] = self.friend(user).username
        data["image"] = self.friend(user).info.profile_img.url
        data["unseen_msg"] = self.unseen_msg(user)
        return data


class Message(models.Model):

    sender = models.ForeignKey("User_Management.User", on_delete=models.CASCADE)
    message = models.TextField(max_length=100)
    sended_at = models.DateTimeField(auto_now_add=True)
    conversation = models.ForeignKey(
        Conversation, related_name="messages", on_delete=models.CASCADE
    )

    @staticmethod
    def new_message(conversation: Conversation, sender, message):
        message = Message(
            conversation=conversation, sender=sender, message=message
        ).save()
        conversation.save()
        return message

    def as_serialized(self, user: User):
        from .serializers import MessageSerializer

        data = dict(MessageSerializer(self).data)
        data["status"] = "sent" if data["sender"] == user.pk else "received"
        return data
