from django.test import TestCase

# Create your tests here.

from User_Management.models import User, Friend
from Chat.models import *

N = 20

main_user = User.objects.get(username="testuser")

i = 1

while i < N:

    _name = f"red_user{i}"

    if User.objects.filter(username=_name).first() is None:
        User.create(
            {
                "email": f"{_name}@gmail.com",
                "username": _name,
                "first_name": _name,
                "last_name": _name,
                "password": f"{_name}{_name}",
            }
        )
    friend = User.objects.get(username=_name)
    friend.add_friend(main_user)
    main_user.accept_friend(friend)
    conversation = Friend.objects.get(user=main_user, friend=friend).conversation
    Message.new_message(conversation, friend, "Hi")
    Message.new_message(conversation, main_user, "Hi back!")
    Message.new_message(conversation, friend, "Hi back back")
    i += 1
