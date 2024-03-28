from rest_framework.utils.serializer_helpers import ReturnDict
from django.db import models
from User_Management.models import User
from core.settings import IMAGES_ROOT_
from django.core.exceptions import ObjectDoesNotExist


class Conversation(models.Model):

    Types = (("G", "GROUP"), ("D", "DM"))
    type = models.CharField(max_length=1, choices=Types)

    @staticmethod
    def create(type):
        instance = Conversation(type=type)
        instance.save()
        return instance.pk

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
    def last_msg_time(self):
        return (
            self.last_message["sended_at"]
            if self.last_message is not None
            else "Wed May 22 2004 00:00:00 GMT+0000 (GMT)"
        )

    @property
    def owned_by_friends(self):
        from User_Management.models import Friend

        friends = Friend.objects.filter(conversation=self)
        users = [friends[0].user, friends[1].user]
        return users

    @property
    def owned_by_group(self):
        if self.type != "G":
            raise ObjectDoesNotExist("The type of conversation is not Group")
        return Group.objects.get(conversation=self)

    @property
    def name(self):
        if self.type == "F":
            return [
                self.owned_by_friends[0].username,
                self.owned_by_friends[1].username,
            ]
        elif self.type == "G":
            return self.owned_by_group.name

    @property
    def image(self):
        if self.type == "F":
            return [
                self.owned_by_friends[0].info.profile_img,
                self.owned_by_friends[1].info.profile_img,
            ]
        elif self.type == "G":
            return self.owned_by_group.image

    @property
    def unseen_msg(self):
        """Currently"""
        return 0

    def as_serialized(self, user: User):
        from .serializers import ConversationSerializer

        def opts_v(arr, value):
            return arr[1] if arr[0] == value else arr[0]

        data = dict(ConversationSerializer(self).data)
        if self.type == "D":
            # assert user != None, "user required if Conversation type 'DM'"
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


class Group(models.Model):

    name = models.CharField(max_length=20)
    image = models.ImageField(upload_to=IMAGES_ROOT_, blank=True)
    conversation = models.OneToOneField("Chat.Conversation", on_delete=models.CASCADE)


class Member(models.Model):

    nickname = models.CharField(max_length=50)
    PRIVILEGE = (("O", "OWNER"), ("A", "ADMIN"), ("R", "REGULAR"))
    privilege = models.CharField(max_length=1, choices=PRIVILEGE)
    user = models.OneToOneField("User_Management.User", on_delete=models.CASCADE)
    group = models.ForeignKey(Group, related_name="members", on_delete=models.CASCADE)
