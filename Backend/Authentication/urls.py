from django.urls import path
from rest_framework_simplejwt.views import token_refresh as jwt_token_refresh
from .views import Register, Login, TwoFactorAuthView

urlpatterns = [
    # Register
    path("register", Register.as_view(), name="register"),
    # Login
    path("login", Login.as_view(), name="login"),
    # 2FA
    path("2FA", TwoFactorAuthView.as_view(), name="2FA"),
    path("2FA/qrcode", TwoFactorAuthView.get_qrcode, name="2FA_qrcode"),
    # To Refresh the JWT token
    path("refresh_token", jwt_token_refresh, name="token_obtain_pair"),
]
