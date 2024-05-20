from django.db import models

class Tournament(models.Model):

    name = models.CharField(max_length=20, unique=True)
    participants = models.ManyToManyField(
        "Tournament.Participant", related_name="tournaments"
    )
    schedule = models.JSONField()
    isEnd = models.BooleanField()
    created_at = models.DateTimeField(auto_now=True)


class Participant(models.Model):

    name = models.CharField(max_length=50)
    user = models.ForeignKey("User_Management.Model", on_delete=models.CASCADE)
