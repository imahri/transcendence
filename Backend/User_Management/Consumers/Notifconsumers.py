from cgitb import text
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from ..models import  Notification, User, Friend
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
            
            
            if action == 'readNotif':
                await self.markAsRead(text_data['id'])
            
            
        except Exception as error:
            print('error : ', error)

  
    async def markAsRead(self, id):
        obj =  await database_sync_to_async(Notification.objects.get)(id=id)
        obj.is_read = True
        await database_sync_to_async(obj.save)()

    async def send_notification(self, event):
        await self.send_json(content={'type' : 'notification', 'action': 'update', 'last_notif' : event['lastNotif']})

    async def send_status(self, event):
        await self.send_json(content={'type' : 'friendShip', 'friend_id': event['friend_id'], 'status' : event['status']})
    

    async def send_user_status(self, channel_layer, friend : User,  user : User):
        try:
            status = ''  
            target_channel = self.get_channel_by_user(friend.username)
            try:
                friendShip = await database_sync_to_async(friend.get_friendship)(user)
                status = friendShip.status
            except Friend.DoesNotExist:
                status = "not friend"
            await channel_layer.send(target_channel, {"type" : "send_status" , "friend_id" : user.id, "status" : status})

        except Exception as error:
            print('update status: ', error)

    @classmethod
    def serilaizeLastNotif(cls, lastNotif):
        NotifSerialized = NotifSerializer(lastNotif).data
        return NotifSerialized

    async def send_notif_user(self, channel_layer , user,  lastNotif):
        try:

            target_channel = self.get_channel_by_user(user.username)

            Notifdata = await database_sync_to_async(self.serilaizeLastNotif)(lastNotif=lastNotif);
            await channel_layer.send(target_channel, {"type" : "send_notification" ,"lastNotif" : Notifdata})

        except Exception as error:
            print('update notification: ', error)