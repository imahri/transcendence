from django.db import models
from core.settings import IMAGES_ROOT_


class Conversation(models.Model):

    Types = (("G", "GROUP"), ("D", "DM"))
    type = models.CharField(max_length=1, choices=Types)

    @staticmethod
    def create(type):
        instance = Conversation(type=type)
        instance.save()
        return instance.pk


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
