from django.db import models


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
    conversation = models.ForeignKey(Conversation)


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
    user_id = models.IntegerField()
    group = models.ForeignKey(Group)
