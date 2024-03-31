from django.test import TestCase

# Create your tests here.

from User_Management.models import User, Friend
from Chat.models import *

N = 3

main_user = User.objects.get(username="testuser")

i = 0

while i < N:

    _name = f"red_user{i}"
    User.create(
        {
            "email": f"{_name}@gmail.com",
            "username": f"{_name}",
            "first_name": f"{_name}",
            "last_name": f"{_name}",
            "password": f"{_name}",
        }
    )
    friend = User.objects.get(username=f"{_name}")
    friend.add_friend(main_user)
    main_user.accept_friend(friend)
    i += 1
