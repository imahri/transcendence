from django.urls import path
from .views import (Register, Login)

# from rest_framework_simplejwt.views import (
#     token_obtain_pair as jwt_token,
#     token_refresh as jwt_token_refresh
# )

urlpatterns = [
    # Register
    path('register', Register.as_view(), name='register'),
    # Login
    path('login', Login.as_view(), name='login'),
    # path('refresh_token', jwt_token_refresh, name='token_obtain_pair')
]
