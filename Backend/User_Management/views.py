from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from Tools.HttpFileResponse import HttpFileResponse
from core.settings import DEFAULT_PROFILE_IMG


from .serializers import UserSerializer, InfoSerializer
from .models import Info, User, Friend
import os

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
            return Response(userObj)
        except Exception as error:
            return Response({"error": str(error)}, status=400)
        
    def post(self, request):
        try:

            UserObj = User.objects.get(id=request.user.pk)

            FormData : dict = request.data.copy()
            password_list = FormData.pop('password')
            password = password_list[0] if isinstance(password_list, list) else password_list

            if password is None or UserObj.check_password(password) is False :
                return Response({"password": "Password Incorrect"}, status=400)

            ancien_img = UserObj.info.profile_img

            UserSerialized = UserSerializer(UserObj, data=request.data)
            infoObj = Info.objects.get(user=UserObj)
            InfoSerialized = InfoSerializer(infoObj, data=request.data)
            if InfoSerialized.is_valid():
                InfoSerialized.save()
            else:
                return Response(InfoSerialized.errors, status=400)
            UserSerialized = UserSerializer(UserObj, data=request.data, partial=True)
            if UserSerialized.is_valid():
                UserSerialized.save()
                UserData = UserSerialized.data
                UserData["info"] = InfoSerializer(
                    Info.objects.get(user=request.user.pk)
                ).data
                if FormData.get('profile_img') is not None and ancien_img != DEFAULT_PROFILE_IMG:
                    os.remove(ancien_img.path)
                      
                return Response(UserData)
            else:
                print(UserSerialized.errors)
                return Response(UserSerialized.errors, status=400)
        except Exception as error:
            return Response({"error": str(error)}, status=400)

    @staticmethod
    @api_view(["GET"])
    def get_user(request):
        try:
            username = request.query_params.get("username")
            friend = User.objects.get(username=username)
            userObj = dict(UserSerializer(friend).data)
            userObj["info"] = InfoSerializer(Info.objects.get(user=friend.pk)).data
            # get the friendship betwen me and the user
            if request.user.pk == friend.pk:
                userObj['friendship'] = 'owner'
            else :
                try :
                    userObj['friendship'] = request.user.get_friendship(friend=friend).status
                except:
                    userObj['friendship'] = 'not friend'

            return Response({"user": userObj})
        except Exception as error:
            return Response({"error": str(error)}, status=400)

    def delete(self, request):
        try:

            password = request.data.get('password')
            user : User = User.objects.get(pk=request.user.pk)
            if not user.check_password(password) :
                return Response({"error": "wrong password"}, status=400)
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
            try :
                isBlocked = request.user.get_friendship(friend=user).is_block
                if isBlocked:
                    continue
            except Exception as error:
                print(error)
            userData = dict(UserSerializer(user).data)
            response.append(userData)

        return Response(data=response)
    except ObjectDoesNotExist as no_found:
        return Response({"error": str(no_found)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def getFriendView(request):
    try:
        user: User = request.user
        if not user.friends.exists():
            raise ObjectDoesNotExist("No results")
        # founded_users = [friend_rl.friend for friend_rl in user.friends]
        founded_users = [friend_rl.friend for friend_rl in user.friends if not friend_rl.is_block]
        if not founded_users:
            raise ObjectDoesNotExist("No results")
        response = []
        for user in founded_users:
            userData = dict(UserSerializer(user).data)
            response.append(userData)
        return Response(data=response)
    except ObjectDoesNotExist as no_found:
        return Response({"error": str(no_found)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def getUserFriends(request):
    try:
        username : str = request.query_params.get("username")
        user : User = User.objects.get(username=username)
        if not user.friends.exists():
            raise ObjectDoesNotExist("No results")
      
        founded_users = user.friends.exclude(status='B')
        if not founded_users:
            raise ObjectDoesNotExist("No results")
        response = []
        for user in founded_users:
            userData = dict(UserSerializer(user.friend).data)
            response.append(userData)
        return Response(data=response)
    except ObjectDoesNotExist as no_found:
        return Response({"error": str(no_found)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def getFewFriend(request):
    try:
        username : str = request.query_params.get("username")
        user : User = User.objects.get(username=username)

        if not user.friends.exists():
            raise ObjectDoesNotExist("No results")


        nb_friends = user.friends.exclude(status='B').count()

        if nb_friends == 0:
            raise ObjectDoesNotExist("No results")

        friends = user.friends.exclude(status='B')[:5]
        response = []
        for user in friends:
            userData = dict(UserSerializer(user.friend).data)
            response.append(userData)
        return Response({"friends": response, "nb" : nb_friends})
    except ObjectDoesNotExist as no_found:
        return Response({"error": str(no_found)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)



class BlockView(APIView):

    def get(self, request):
        try:
            user : User = request.user

            if not user.friends.exists():
                raise ObjectDoesNotExist("No results")


            friends = user.friends.filter(status='B')
            if not friends:
                raise ObjectDoesNotExist("No results")

            response = []
            for user in friends:
                userData = dict(UserSerializer(user.friend).data)
                response.append(userData)
            return Response(data=response)
        except ObjectDoesNotExist as no_found:
            return Response({"error": str(no_found)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as error:
            return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request):
        try:
            user : User = request.user

            friend_id = request.data.get('friend_id')
            friend : User = User.objects.get(id=friend_id)

            friendship =  user.get_friendship(friend=friend)          
            friendship.deblock()

            return Response(data=friendship.is_block==False)

        except Exception as error:
            return Response({"error": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        