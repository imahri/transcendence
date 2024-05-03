from django.urls import path


from .views import MatchView, BadgeView, BoardView, PadleView, ItemsView

urlpatterns = [
    
    path("", MatchView.as_view(), name="create"),
    path("badge", BadgeView.as_view(), name="badge"),
    path("badge/<int:pk>", BadgeView.as_view(), name="badgeUpdate"),
    path("board", BoardView.as_view(), name="board"),
    path("board/<int:pk>/", BoardView.as_view(), name="boardUpdate"),
    path("padle", PadleView.as_view(), name="padle"),
    path("padle/<int:pk>/", PadleView.as_view(), name="padleUpdate"),
    #user collection of items
    path("items", ItemsView.as_view(), name="items"),

]
