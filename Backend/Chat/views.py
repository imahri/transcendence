from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from User_Management.models import User, Friend
from .models import Conversation, Message
from django.db.models import Q, Count, Max


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
        "[ deprecated ]"
        id = Conversation.create().pk
        return JsonResponse({"id": id})

    @catch_view_exception
    def get(self, request):
        user: User = request.user
        limit = int(request.query_params.get("limit"))
        offset = int(request.query_params.get("offset"))

        queryset = Conversation.objects.annotate(
            isExist=Q(owners__pk__contains=user.pk), num_messages=Count("messages")
        )
        conversations = queryset.filter(isExist=True, num_messages__gt=0).order_by(
            "-last_modified"
        )[
            offset : offset + limit
        ]  # ?? check this later  # !! check the order
        conversations_arr = [
            conversation.as_serialized(user) for conversation in conversations
        ]
        return Response(
            {"size": len(conversations_arr), "conversations": conversations_arr}
        )

    def delete(self, request):
        pass


class MessageView(APIView):

    @catch_view_exception
    def get(self, request):
        user: User = request.user
        conversation: Conversation = Conversation.objects.get(
            pk=request.query_params.get("conversation")
        )
        limit = int(request.query_params.get("limit"))
        offset = int(request.query_params.get("offset"))

        messages = Message.objects.filter(conversation=conversation).order_by(
            "-sended_at"
        )[offset : offset + limit]

        """
            {
                size: <how many messages>,
                messages: [
                    {
                        message: <text>,
                        sent_time: <00:00 AM>,
                        sender: <username>
                        type: <sent or received>
                    },
                ]
                .
                .
                .
                <limit>
            }
        """

        messages_arr = [message.as_serialized(user) for message in messages]

        Response({"size": len(messages_arr), "messages": messages_arr})
