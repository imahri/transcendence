from django.urls import path

from .views import ImageView, UserView, InfoView, searchView
from .views import getFriendView, getFewFriend, getUserFriends, BlockView, NotifView

urlpatterns = [
    path("", UserView.as_view(), name="user"),
    path("user", UserView.get_user, name="otheruser"),
    path("image", ImageView.as_view(), name="image"),
    path("info", InfoView.as_view(), name="info"),
    path("search", searchView, name="search"),
    path("friends", getFriendView, name="friends"),
    path("somefriends", getFewFriend, name="fewfriends"),
    path("userfriends", getUserFriends, name="userfriends"),
    path("block", BlockView.as_view(), name="getblocked"),
    path("notification", NotifView.as_view(), name="notification"),
]