from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from Tools.HttpFileResponse import HttpFileResponse

from .serializers import UserSerializer, InfoSerializer
from .models import Info, User


# Create your views here.


class ImageView(APIView):

    def check_permissions(self, request):
        if request.method == "GET":
            return True
        return super().check_permissions(request)

    def get(self, request):
        try:
            path = request.GET.get("path")
            path = path.lstrip("/")
            return HttpFileResponse(path, Content_type="image/png")
        except Exception as error:
            return Response({"error": str(error)}, status=400)


class UserView(APIView):

    def get(self, request):
        try:
            userObj = dict(UserSerializer(request.user).data)
            userObj["info"] = InfoSerializer(
                Info.objects.get(user=request.user.pk)
            ).data
            return Response({"user": userObj})
        except Exception as error:
            return Response({"error": str(error)}, status=400)

        

    @staticmethod
    @api_view(["GET"])
    def get_user(request):
        try:
            username = request.query_params.get("username")
            user = User.objects.get(username=username);
            userObj = dict(UserSerializer(user).data)
            userObj["info"] = InfoSerializer(
                Info.objects.get(user=user.pk)
            ).data
            return Response({"user": userObj})
        except Exception as error:
            return Response({"error": str(error)}, status=400)


    def delete(self, request):
        try:

            user = User.objects.get(pk=request.user.pk)
            user.delete()
            return Response({"yes": "yes"})

        except Exception as error:
            return Response({"error": str(error)}, status=400)


class InfoView(APIView):

    def post(self, request):
        try:
            infoObj = Info.objects.get(user=request.user.pk)
            serializer = InfoSerializer(infoObj, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=400)
        except Exception as error:
            return Response({"error": str(error)}, status=400)


@api_view(["GET"])
def searchView(request):
    try:
        search_text: str = request.query_params.get("search")
        founded_users = User.objects.filter(username__icontains=search_text)
        if not founded_users.exists():
            raise ObjectDoesNotExist(f"No results found for {search_text}")
        response = []
        for user in founded_users:
            userData = dict(UserSerializer(user).data)
            userData['img'] = dict(user.get_info())['profile_img']
            response.append(userData)
        return Response(data=response)
    except ObjectDoesNotExist as no_found:
        return Response({'error': str(no_found)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)

# Here
# @api_view(["GET"])
# def getFriendView(request):
#     user: User = request.user
#     for friend_rl in user.friends:
#         pass
#     response = []
#     for user in founded_users:
#         userData = dict(UserSerializer(user).data)
#         userData['img'] = dict(user.get_info())['profile_img']
#         response.append(userData)
#     return Response(data=response)