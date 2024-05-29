from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, exceptions
from rest_framework.exceptions import NotAcceptable, AuthenticationFailed
from Tools.HttpFileResponse import HttpFileResponse
from User_Management.models import Info, User
from User_Management.serializers import InfoSerializer, UserSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
import requests
from User_Management.serializers import UserSerializer

# ! Use request.user


@permission_classes([AllowAny])
class Register(APIView):
    """Register View"""

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else :
                return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as error:
            print(error)
            return JsonResponse({"failure" :str(error)}, status=status.HTTP_400_BAD_REQUEST)


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
                raise AuthenticationFailed("Wrong password")
            if user.is_2FA_active is True:
                return JsonResponse({"success": "2FA Required"})
            if user.is_42_account is True:
                return JsonResponse({"detail": "you cant sign-in"}, status=401)
            access_token, refresh_token = Login.genJWT(user)
            userObj = dict(UserSerializer(user).data)
            userObj['info'] = InfoSerializer(Info.objects.get(user=user.pk)).data

            return JsonResponse(
                {
                    "user": userObj,
                    "access": access_token,
                    "refresh": refresh_token,
                }
            )
        except Exception as error:
            raise exceptions.AuthenticationFailed(str(error))

    def delete(self, request):
        pass

@api_view(["GET"])
def check_token(request):
    """
    check the access token
    """
    return Response(data="Token is Valid", status=200)


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

    @staticmethod
    @api_view(["GET"])
    def get_qrcode(request):
        """
        get qrcode only
        """
        try:
            user = User.get_by_identifier(request.user.username)
            if user.is_2FA_active is False:
                raise exceptions.NotAcceptable(detail="2FA is off")
            return HttpFileResponse(user.qrcode_2FA, Content_type="image/png")
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
            if not request.user.is_2FA_active:
                raise NotAcceptable("2FA is already off")
            user = User.get_by_identifier(request.user.username)
            User.TwoFactorAuth.turn_off_2FA(user)
            return Response("2FA turn off successfully")
        except NotAcceptable as error:
            raise error
        except Exception as error:
            return JsonResponse(
                {"failure": str(error)}, status=status.HTTP_400_BAD_REQUEST
            )

@permission_classes([AllowAny])
class intra_auth(APIView):

    @staticmethod
    def get_42user_info(access_token):
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
        data = response.json()
        if response.status_code != 200:
            raise Exception(data.get('error'))
        return data
    
    @staticmethod
    def get_42access_token(code : str):
        
        data = {
            'grant_type': 'authorization_code',
            'client_id': 'u-s4t2ud-ef24706709b2ebced52c2f14a643d130751366c3ebabc309cb18be033c4f8259',
            'client_secret': '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',
            'code': code,
            'redirect_uri': 'http://localhost:3000/login'
        }
   
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        
        data = response.json()
        if response.status_code != 200:
            raise Exception(data.get('error'))
        access_token = data.get('access_token')
        return access_token

    def post(self, request):

        try:
            code = request.data.get('code')
            access_token = intra_auth.get_42access_token(code=code)
            user42_info = intra_auth.get_42user_info(access_token=access_token)

            returnValue = User.create42User(user42_info)
            if not returnValue[0]:
                return Response(data=returnValue[1], status=401)

            user : User = returnValue[1]

            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)
            return JsonResponse({'access': str(access_token), 'refresh': str(refresh_token)}, status=200)
        
        except Exception as error:
            return JsonResponse({'register' : str(error)}, status=401)