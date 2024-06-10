from typing import Any
from django.core.management.base import BaseCommand
from User_Management.models import User
from User_Management.serializers import UserSerializer


class Command(BaseCommand):
    help = "init default users"

    def handle(self, *args, **options):
        users = [
            {"username": "sakawi", "first_name": "oussama", "last_name": "krich", "password": "sakawisakawi"},
            {"username": "redmega", "first_name": "radouane", "last_name": "iben-hamou", "password": "redmegaredmega"},
            {"username": "fiddler", "first_name": "imad", "last_name": "mahri", "password": "fiddlerfiddler"},
        ]
        try:
            for user in users:
                user_obj = UserSerializer(data=user)
                if user_obj.is_valid():
                    user_obj.save()
                else:
                  self.stderr.write(self.style.ERROR(f"User {user['username']} not created because: {user_obj.errors}"))
            self.stdout.write(self.style.SUCCESS("Users Created successfully"))
        except Exception as error:
            self.stderr.write(self.style.ERROR(f"Users not created because: {error}"))