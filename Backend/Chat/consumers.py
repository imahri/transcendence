from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from Chat.models import Conversation, Message
from User_Management.models import User


class ChatConsumer(AsyncJsonWebsocketConsumer):
    channels: dict = {}

    @classmethod
    def register_channel(cls, username: str, channel_name: str):
        cls.channels[username] = channel_name

    @classmethod
    def get_channel_by_user(cls, user: str):
        return cls.channels.get(user, None)

    async def connect(self):
        try:
            self.user: User = self.scope["user"]
            if not self.user.is_authenticated:
                raise Exception("Not Authorizer")
            else:
                self.register_channel(self.user.username, self.channel_name)
                await self.accept()
                await self.send_json(content={"type": "Connected"})
        except Exception:
            await self.close()

    async def receive_json(self, content):
        try:
            await self.directMessage(content)
        except Exception as error:
            await self.send_error(str(error) + " receive_json()")

    async def receive_message(self, content):
        """
        {
            type: 'message',
            status: <received>
            sender: {
                type: <type>,
                name: <name>
            },
            message: <text>,
            time: <current_time>
        }
        """
        try:
            content["status"] = "received"
            await self.send_json(content=content)
        except Exception as error:
            await self.send_error(str(error) + " message()")

    async def directMessage(self, content):
        """
        {
            send_to: <friend_username>,
            message: <text>,
            time: <current_time>
        }
        """
        try:
            send_to = content["send_to"]
            message = content["message"]
            sended_at = content["sended_at"]
            conversation = await database_sync_to_async(Conversation.objects.get)(
                pk=content["conversation_id"]
            )
            receiver = self.get_channel_by_user(send_to)
            if receiver is not None:
                await self.channel_layer.send(
                    receiver,
                    {
                        "type": "receive_message",
                        "sender": self.user.username,
                        "message": message,
                        "sended_at": sended_at,
                    },
                )
            await database_sync_to_async(Message.new_message)(
                conversation, self.user, message
            )
        except Exception as error:
            await self.send_error(str(error) + " directMessage()")

    async def send_error(self, error_msg: str):
        await self.send_json(content={"type": "error", "error": error_msg})

    async def disconnect(self, code):
        self.channels.pop("testuser", None)
        await self.close(code)
