import json
from math import exp
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from User_Management.models import User


class ChatConsumer(AsyncJsonWebsocketConsumer):
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
            print(self.user)
            if self.user.is_anonymous:
                raise Exception("Not Authorizer")
            else:
                self.register_channel(self.user.username, self.channel_name)
                await self.accept()
                await self.send_json(content={"type": "Connected"})
        except Exception:
            await self.close()

    async def receive_json(self, content):
        try:
            type = content["type"]
            if type == "DM":
                await self.directMessage(content)
        except Exception as error:
            await self.send_error(str(error) + " receive_json()")

    async def message(self, content):
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
            await self.send_json(content=content)
        except Exception as error:
            await self.send_error(str(error) + " message()")

    async def directMessage(self, content):
        """
        {
            type: 'DM',
            send_to: <friend_username>,
            message: <text>,
            time: <current_time>
        }
        """
        try:
            send_to = content["send_to"]
            message = content["message"]
            time = content["time"]
            receiver = self.get_channel_by_user(send_to)
            await self.channel_layer.send(
                receiver,
                {
                    "type": "message",
                    "status": "received",
                    "sender": {"type": "DM", "name": self.user.username},
                    "message": message,
                    "time": time,
                },
            )
            await self.send_json(
                {
                    "type": "message",
                    "status": "sent",
                    "receiver": {"type": "DM", "name": send_to},
                    "message": message,
                    "time": time,
                },
            )
        except Exception as error:
            await self.send_error(str(error) + " directMessage()")

    async def send_error(self, error_msg: str):
        await self.send_json(content={"type": "error", "error": error_msg})
