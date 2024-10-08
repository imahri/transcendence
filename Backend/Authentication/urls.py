from django.urls import path
from rest_framework_simplejwt.views import (
    token_refresh as jwt_token_refresh,
    token_blacklist as jwt_token_blacklist,
)
from .views import Register, Login, TwoFactorAuthView, intra_auth, check_token

urlpatterns = [
    # Register
    path("register", Register.as_view(), name="register"),
    # Login
    path("login", Login.as_view(), name="login"),
    # Login 42
    path("42auth", intra_auth.as_view(), name="intra"),
    # check access Token
    path("verify_token", check_token, name="token"),
    # Logout
    path("logout", jwt_token_blacklist, name="logout"),
    # To Refresh the JWT token
    path("refresh_token", jwt_token_refresh, name="token_obtain_pair"),
    # 2FA
    path("2FA", TwoFactorAuthView.as_view(), name="2FA"),
    path("2FA/qrcode", TwoFactorAuthView.get_qrcode, name="2FA_qrcode"),
]
