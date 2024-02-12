from django.urls import path
from rest_framework_simplejwt.views import token_refresh as jwt_token_refresh
from .views import (
    Register,
    Login
)

urlpatterns = [
    # Register
    path('register', Register.as_view(), name='register'),
    # Login
    path('login', Login.as_view(), name='login'),
    # To Refresh the JWT token
    path('refresh_token', jwt_token_refresh, name='token_obtain_pair')
]
