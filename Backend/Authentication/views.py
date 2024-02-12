from pickle import TRUE
import stat
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import (status, exceptions)
from User_Management.models import User
from User_Management.serializers import UserSerializer
from rest_framework_simplejwt.tokens import (AccessToken, RefreshToken)
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist


class Register(APIView):
    ''' Register View '''

    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid() is False:
                raise exceptions.AuthenticationFailed()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as error:
            return JsonResponse({"failure": str(error)}, status=status.HTTP_400_BAD_REQUEST)


class Login(APIView):
    ''' Login View '''

    @staticmethod
    def genJWT(user: User):
        return AccessToken.for_user(user).__str__(), RefreshToken.for_user(user).__str__()

    def post(self, request):
        ''' Login with { identifier, password  } '''
        try:
            identifier = request.data.get('identifier')
            password = request.data.get('password')
            user = User.objects.filter(Q(username=identifier) | Q(email=identifier)).first()
            if user is None:
                raise ObjectDoesNotExist()
            if user.check_password(password) is False:
                return None
            access_token, refresh_token = Login.genJWT(user)
            return JsonResponse({
                'user': user.get_full_name(),
                'access': access_token,
                'refresh': refresh_token
            })
        except Exception as error:
            raise exceptions.AuthenticationFailed(str(error))
