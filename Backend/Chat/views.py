from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request
from User_Management.models import User, Friend
from .models import Conversation, Message
from django.db.models import Q, Count, Max
from django.core.paginator import Paginator


def catch_view_exception(func):

    def Wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except Exception as error:
            return Response(
                data={"error": str(error)}, status=status.HTTP_400_BAD_REQUEST
            )

    return Wrapper


class ConversationView(APIView):

    @catch_view_exception
    def options(self, request):

        user: User = request.user
        friend: User = User.get_by_identifier(request.query_params.get("FriendName"))
        frined_rl = Friend.objects.filter(user=user, friend=friend).first()
        if frined_rl is None:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"conversation_id": frined_rl.conversation.pk})

    @catch_view_exception
    def get(self, request):
        PER_PAGE = 12
        user: User = request.user
        offset = int(request.query_params.get("offset"))
        last: bool = bool(request.query_params.get("last", False))

        queryset = Conversation.objects.annotate(
            isExist=Q(owners__pk__contains=user.pk), num_messages=Count("messages")
        )
        conversation_list = (
            queryset.filter(isExist=True, num_messages__gt=0)
            .order_by("-last_modified")
            .distinct()
        )
        conversation_list = [  # TODO: do it in queryset
            conversation
            for conversation in conversation_list
            if conversation.check_is_friend
        ]
        PaginatorConv = Paginator(
            conversation_list, PER_PAGE, allow_empty_first_page=False
        )
        if offset <= 0 or offset > PaginatorConv.num_pages:
            return Response(
                {"error": "Out of range"}, status=status.HTTP_406_NOT_ACCEPTABLE
            )
        conversations = PaginatorConv.get_page(offset)
        if last:
            last_index = conversations.__len__() - 1
            return Response(conversations[last_index].as_serialized(user))
        conversations_arr = [
            conversation.as_serialized(user) for conversation in conversations
        ]
        print(conversations)
        return Response(
            {
                "size": len(conversations_arr),
                "conversations": conversations_arr,
                "has_next": conversations.has_next(),
            }
        )

    @staticmethod
    @api_view(["GET"])
    @catch_view_exception
    def get_conversation(request, friend_name: str):
        user: User = request.user
        friend: User = User.get_by_identifier(friend_name)
        conversation: Conversation = Friend.objects.get(
            user=user, friend=friend
        ).conversation
        return Response(conversation.as_serialized(user))

    @staticmethod
    @api_view(["GET"])
    @catch_view_exception
    def get_last_message(request, id: int):
        conversation: Conversation = Conversation.objects.get(pk=id)
        last_message = conversation.last_message
        if last_message is None:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(last_message)

    def delete(self, request):
        pass


class MessageView(APIView):

    @catch_view_exception
    def get(self, request):
        PER_PAGE = 10
        user: User = request.user
        conversation: Conversation = Conversation.objects.get(
            pk=request.query_params.get("conversation")
        )
        offset = int(request.query_params.get("offset"))
        message_list = Message.objects.filter(conversation=conversation).order_by(
            "-sended_at"
        )
        PaginatorMessages = Paginator(
            message_list, PER_PAGE, allow_empty_first_page=False
        )
        if offset <= 0 or offset > PaginatorMessages.num_pages:
            return Response(
                {"error": "Out of range"}, status=status.HTTP_406_NOT_ACCEPTABLE
            )
        messages = PaginatorMessages.get_page(offset)
        messages_arr = [message.as_serialized(user) for message in messages]
        return Response(
            {
                "size": len(messages_arr),
                "messages": messages_arr,
                "has_next": messages.has_next(),
            }
        )
