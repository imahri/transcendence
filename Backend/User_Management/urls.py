from django.urls import path


from .views import ImageView, UserView, InfoView, searchView

urlpatterns = [
    path("", UserView.as_view(), name="user"),
    path("user", UserView.get_user, name="otheruser"),
    path("image", ImageView.as_view(), name="image"),
    path("info", InfoView.as_view(), name="info"),
    path("search", searchView, name="search"),
    path("user", searchView, name="search"),
]
