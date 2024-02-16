from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, exceptions
from Tools.HttpFileResponse import HttpFileResponse
from User_Management.models import User
from User_Management.serializers import UserSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny


@permission_classes([AllowAny])
class Register(APIView):
    """Register View"""

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid() is False:
                raise exceptions.AuthenticationFailed()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as error:
            return JsonResponse(
                {"failure": str(error)}, status=status.HTTP_400_BAD_REQUEST
            )


@permission_classes([AllowAny])
class Login(APIView):
    """Login View"""

    @staticmethod
    def genJWT(user: User):
        return (
            AccessToken.for_user(user).__str__(),
            RefreshToken.for_user(user).__str__(),
        )

    def post(self, request):
        """Login with { identifier, password  }"""
        try:
            identifier = request.data.get("identifier")
            password = request.data.get("password")
            user = User.get_by_identifier(identifier)
            if user is None:
                raise ObjectDoesNotExist()
            if user.check_password(password) is False:
                return None
            access_token, refresh_token = Login.genJWT(user)
            return JsonResponse(
                {
                    "user": user.get_full_name(),
                    "access": access_token,
                    "refresh": refresh_token,
                }
            )
        except Exception as error:
            raise exceptions.AuthenticationFailed(str(error))


class TwoFactorAuthView(APIView):
    """Two_Factor_Auth"""

    def check_permissions(self, request):
        if request.method == "GET":
            return True
        return super().check_permissions(request)

    def post(self, request):
        """
        Enable 2FA: no body required
        """
        try:
            user = User.get_by_identifier(request.user.username)
            if user.is_2FA_active is True:
                raise exceptions.NotAcceptable(detail="2FA is already on")
            qrcode_path = User.TwoFactorAuth.turn_on_2FA(user)
            return HttpFileResponse(qrcode_path, Content_type="image/png")
        except Exception as error:
            raise exceptions.ValidationError(str(error))

    @api_view(["GET"])
    def get_qrcode(self, request):
        """
        get qrcode only
        """
        try:
            user = User.get_by_identifier(request.user.username)
            if user.is_2FA_active is False:
                raise exceptions.NotAcceptable(detail="2FA is off")
            if request.GET.get("qrcode") == "only":
                return HttpFileResponse(user.qrcode_2FA)
        except Exception:
            return exceptions.NotAuthenticated()

    def get(self, request):
        """
        verify OTP: add user=<username>&OTP=<otp code> in query parametre
        """
        try:
            otp = request.GET.get("OTP")
            user = User.get_by_identifier(request.GET.get("user"))
            if User.TwoFactorAuth.verify(user, otp) is False:
                raise exceptions.AuthenticationFailed("invalid OTP")
            access_token, refresh_token = Login.genJWT(user)
            return JsonResponse(
                {
                    "user": user.get_full_name(),
                    "access": access_token,
                    "refresh": refresh_token,
                }
            )
        except Exception as error:
            raise exceptions.AuthenticationFailed(str(error))

    def delete(self, request):
        """
        Disable 2FA: no body required
        """
        try:
            user = User.get_by_identifier(request.user.username)
            User.TwoFactorAuth.turn_off_2FA(user)
            return Response("2FA turn off successfully")
        except Exception as error:
            return JsonResponse(
                {"failure": str(error)}, status=status.HTTP_400_BAD_REQUEST
            )
