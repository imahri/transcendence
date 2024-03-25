import imp
import json
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request
from User_Management.models import User, Friend
from .models import Conversation, Message, Group, Member


def catch_view_exception(func):

    def Wrapper(self, request):
        try:
            return func(self, request)
        except Exception as error:
            return Response(data={"error": str(error)})

    return Wrapper


class ConversationView(APIView):

    @catch_view_exception
    def post(self, request):
        user = request.user
        type = request.data["type"]
        mode = "D"
        if type == "Group":
            mode = "G"
        id = Conversation.create(mode)
        return JsonResponse({"id": id})

    @catch_view_exception
    def get(self, request):
        user: User = request.user
        limit = int(request.query_params.get("limit"))
        offset = int(request.query_params.get("offset"))
        type = "D" if request.query_params.get("type") == "Friend" else "G"

        conversations = Conversation.objects.filter(type=type).order_by(
            "-last_msg_time"
        )[offset : offset + limit]
        # check the order

        conversations_arr = []


        """
        {
            'size': <how many conversations>,
            conversations: [
                {
                    'id': <id>,
                    'type': <Friend or Group>,
                    'name': <name of Friend or group>,
                    'img_url': <url to friend profile img>,
                    'last_msg': {
                        'message': <text>,
                        'sent_time': <00:00 AM>
                    },
                    'unseen_msg': <number>,
                }
                .
                .
                .
            ]
        }
        """

        for conversation in conversations:
            conversations_arr.append({})

        return Response(
            {"size": len(conversations_arr), "conversations": conversations_arr}
        )

    def delete(self, request):
        pass


class MessageView(APIView):
    pass
