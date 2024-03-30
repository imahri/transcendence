from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from ..models import  User
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
            
        except Exception as error:
            print('error : ', error)

 
    async def getAllNotif(self):
        
        allNotification = await database_sync_to_async(self.user.get_all_notif)()
        response = await database_sync_to_async(convertNotification)(allNotification)
        await self.send_json(content={'type': 'all_notif' ,'all_notif': response})

    
    async def update(self, event):
        await self.send_json(content={'type': 'update', 'last_notif' : event['lastNotif']})

    async def send_notif_user(self, user, channel_layer, lastNotif):
        try:
            target_channel = self.get_channel_by_user(user.username)
            NotifSerialized = NotifSerializer(lastNotif).data;
            await channel_layer.send(target_channel, {"type": "update", 'lastNotif' : NotifSerialized})

        except Exception as error:
            print('user key not found : ', error)



def convertNotification(allNotification):

    response = []

    if allNotification.exists():
            for notif in allNotification:
                notifData = dict(NotifSerializer(notif).data)
                response.append(notifData)
    
    return response