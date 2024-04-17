from cgitb import text
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from ..models import  Notification, User
from ..serializers import NotifSerializer

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
               raise Exception("Not Authorizer")
           else:
            self.register_channel(self.user.username, self.channel_name)
            await self.accept()
        
        except Exception as error:
           print('Notification ws connect : ', error);
           await self.close();


    
    async def disconnect(self, close_code):
        username : str = self.user.username
        if username in self.channels:
            del self.channels[username]

    
    async def receive_json(self, text_data):
        try:
            action = text_data["action"]
            if action == 'all_notif':
                await self.getAllNotif()
            elif action == 'read':
                await self.markAsRead(text_data['id'])
            
        except Exception as error:
            print('error : ', error)

 
    async def getAllNotif(self):
        
        response = await database_sync_to_async(Notification.allNotifSerialised)(self.user)
        nbUnreadedNotif = await database_sync_to_async(Notification.getNBUnreadedNotif)(self.user);
        await self.send_json(content={'type': 'all_notif' ,'all_notif': response, 'unreaded': nbUnreadedNotif})

    async def markAsRead(self, id):
        obj =  await database_sync_to_async(Notification.objects.get)(id=id)
        obj.is_read = True
        await database_sync_to_async(obj.save)()

    
    async def update(self, event):
        await self.send_json(content={'type': 'update', 'last_notif' : event['lastNotif']})

    @classmethod
    def serilaizeLastNotif(cls, lastNotif):
        NotifSerialized = NotifSerializer(lastNotif).data
        return NotifSerialized

    async def send_notif_user(self, user, channel_layer, lastNotif):
        try:

            target_channel = self.get_channel_by_user(user.username)

            Notifdata = await database_sync_to_async(self.serilaizeLastNotif)(lastNotif=lastNotif);
            await channel_layer.send(target_channel, {"type": "update", 'lastNotif' : Notifdata})

        except Exception as error:
            print('update notification: ', error)
