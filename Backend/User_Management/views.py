from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
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
