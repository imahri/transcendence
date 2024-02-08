from django.db import models
from ..User_Management.models import User

class Conversation(models.Model):

    Modes = (
        ('G', "GROUP"),
        ('D', "DM")
    )
    mode = models.CharField(choices=Modes)


class Message(models.Model):

    sender_id = models.IntegerField()
    message = models.TextField(max_length=100)
    sended_at = models.TimeField(auto_now=True)
    conversation = models.ForeignKey(Conversation, related_name="messages", null=True, on_delete=models.SET_NULL)


class Group(models.Model):

    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to="images", blank=True)
    conversation_id = models.IntegerField()



class Member(models.Model):
    
    nickname = models.CharField()
    PRIVILEGE = (
        ('O', "OWNER"),
        ('A', "ADMIN"),
        ('R', "REGULAR")
    )
    privilege = models.CharField(choices=PRIVILEGE)
    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL)
    group = models.ForeignKey(Group, related_name="members", null=True, on_delete=models.SET_NULL)
