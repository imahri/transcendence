from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from Chat.models import Conversation

from ..models import Notification, User, Friend


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    channels: dict = {}

    @classmethod
    def register_channel(cls, username: str, channel_name: str):
        cls.channels[username] = channel_name

    @classmethod
    def get_channel_by_user(cls, user: str):
        return cls.channels[user]

    async def connect(self):
        try:
            self.user: User = self.scope["user"]
            if self.user.is_anonymous:
                raise Exception("Not Authorized")
            else:
                print("Notification ws connect : ")
                self.register_channel(self.user.username, self.channel_name)
                await self.accept()
                group_name = f"{self.user.username}_status"
                await self.channel_layer.group_send(
                    group_name,
                    {
                        "type": "send_Onlinestatus",
                        "username": self.user.username,
                        "status": "online",
                    },
                )

        except Exception as error:
            print("Notification ws connect error : ", error)
            await self.disconnect(None)

    async def disconnect(self, close_code):
        print(self.user.username, " disconnect from ws", close_code)
        username: str = self.user.username
        group_name = f"{username}_status"
        await self.channel_layer.group_send(
            group_name,
            {"type": "send_Onlinestatus", "username": username, "status": "offline"},
        )
        self.channels.pop(username, None)

    async def receive_json(self, text_data):
        try:
            action = text_data["action"]

            if action == "readNotif":
                await self.markAsRead(text_data["id"])
            elif action == "markConversationAsRead":
                await self.markConversationAsRead(text_data["id"])
            elif action == "checkStatus":
                await self.checkOnline(text_data["username"])
            elif action == "end_checkStatus":
                await self.discardFromGroup(text_data["username"])
            elif action == "send_notif":
                await self.send_notification(text_data["content"])
            elif action == "set_friendship":
                await self.set_friendship(text_data["content"])

        except Exception as error:
            print("error : ", error)

    async def discardFromGroup(self, username):
        group_name = f"{username}_status"
        await self.channel_layer.group_discard(group_name, self.channel_name)

        print(self.user.username, " deleted from : ", group_name)

    async def markConversationAsRead(self, id):
        """
        action: markConversationAsRead
        id: <id>
        """
        notifications = await database_sync_to_async(self.user.notifications.all)()
        await database_sync_to_async(Notification.conversationAsRead)(id, notifications)

    async def checkOnline(self, username):
        try:
            # add this user to group with name of target user_status : DONE
            group_name = f"{username}_status"
            await self.channel_layer.group_add(group_name, self.channel_name)

            print(self.user.username, " user added to : ", group_name)
            target_channel = self.get_channel_by_user(username)
            await self.send_json(
                content={
                    "type": "onlineStatus",
                    "username": username,
                    "status": "online",
                }
            )

        except Exception as error:
            print("online status catch : ", error)
            await self.send_json(
                content={
                    "type": "onlineStatus",
                    "username": username,
                    "status": "offline",
                }
            )

    async def markAsRead(self, id):
        user: User = self.user
        obj: Notification = await database_sync_to_async(Notification.objects.get)(
            id=id
        )
        if obj.is_multicast:
            obj.content["readed"].append(user.pk)
        else:
            obj.is_read = True
        await database_sync_to_async(obj.save)()

    async def send_Onlinestatus(self, event):
        await self.send_json(
            content={
                "type": "onlineStatus",
                "username": event["username"],
                "status": event["status"],
            }
        )

    async def send_status(self, event):

        friend = event["friend"]
        user = event["user"]
        friend_id = friend.id
        friend_name = friend.username
        status = ""
        try:
            friendShip = await database_sync_to_async(user.get_friendship)(friend)
            status = friendShip.status
        except Friend.DoesNotExist:
            status = "not friend"

        await self.send_json(
            content={
                "type": "friendShip",
                "friend_id": friend_id,
                "friendName": friend_name,
                "status": status,
            }
        )

    async def send_friend_status(self, friend: User, user: User):
        try:
            target_channel = self.get_channel_by_user(friend.username)
            await self.channel_layer.send(
                target_channel, {"type": "send_status", "friend": user, "user": friend}
            )

        except Exception as error:
            print("update status: ", error)

    async def redirect(self, event):
        content = event["content"]
        if content["type"] == "C":
            id = content["content"]["conversationID"]
            conversation: Conversation = await database_sync_to_async(
                Conversation.objects.get
            )(id=id)
            serializerd: dict = await database_sync_to_async(
                conversation.as_serialized
            )(self.user)
            content["content"]["conversation"] = serializerd
        await self.send_json({"type": "notification", "content": content})

    async def send_notification(self, content):
        """
        {
            to: <to>
            type: <
                    ("C", "Chat"),
                    ("F", "Friendship"),
                    ("G", "Game"),
                    ("T", "Tournament"),
                    >
            content: <content>
        }
        """
        try:
            notification: Notification = await database_sync_to_async(
                Notification.create
            )(self.user, content)
            sended_to_CL = self.get_channel_by_user(content["to"])
            data = await database_sync_to_async(notification.as_serialized)()
            await self.channel_layer.send(
                sended_to_CL, {"type": "redirect", "content": data}
            )
        except Exception as error:
            print("notif error : ", error)

    async def set_friendship(self, content: dict):
        """
        {
            content = {firend_id , action}
        }
        """
        try:
            user: User = self.user
            action = content["action"]
            friend: User = await database_sync_to_async(User.objects.get)(
                pk=content["friend_id"]
            )

            # set friendship
            if action == "add":
                await database_sync_to_async(user.add_friend)(friend=friend)
            elif action == "accept":
                await database_sync_to_async(user.accept_friend)(friend=friend)
            elif action == "remove":
                await database_sync_to_async(user.delete_friend)(friend=friend)
            elif action == "block":
                await database_sync_to_async(user.block_friend)(friend=friend)
            elif action == "Unblock":
                await database_sync_to_async(user.deblock_friend)(friend=friend)

            # send the actual status to current
            await self.send_status({"user": user, "friend": friend})

            # create notification if is necasser send it
            if action == "add" or action == "accept":
                content = {
                    "type": "F",
                    "to": friend.username,
                    "content": {"status": action},
                }
                await self.send_notification(content=content)

            # send new status to friend
            await self.send_friend_status(friend, user)
        except Exception as error:
            print(error)
