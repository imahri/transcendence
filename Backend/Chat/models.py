from django.db import models
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
        class LastMessage:
            def __init__(self, sent_time, message) -> None:
                self.sent_time: str = sent_time
                self.message: str = message

        message = self.messages.order_by("-sended_at").first()
        if message is None:
            raise ObjectDoesNotExist("no messages")
        return {"sended_at": message.sended_at, "message": message.message}

    @property
    def owner_by_friends(self):
        from User_Management.models import Friend

        friends = Friend.objects.filter(conversation=self)
        users = [friends[0].user, friends[1].user]
        return users

    @property
    def owner_by_group(self):
        if self.type is not "G":
            raise ObjectDoesNotExist("The type of conversation is not Group")
        return Group.objects.get(conversation=self)

    @property
    def name(self):
        if self.type is "F":
            return [
                self.owner_by_friends[0].username,
                self.owner_by_friends[1].username,
            ]
        elif self.type is "G":
            return self.owner_by_group.name

    @property
    def image(self):
        if self.type is "F":
            return [
                self.owner_by_friends[0].info.profile_img,
                self.owner_by_friends[1].info.profile_img,
            ]
        elif self.type is "G":
            return self.owner_by_group.image

    @property
    def unseen_msg(self):
        ''' Currently '''
        return 0


class Message(models.Model):

    sender_id = models.IntegerField()
    message = models.TextField(max_length=100)
    sended_at = models.TimeField(auto_now=True)
    conversation = models.ForeignKey(
        Conversation, related_name="messages", on_delete=models.CASCADE
    )


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
