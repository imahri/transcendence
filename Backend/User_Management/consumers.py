from importlib.resources import contents
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Notification, User
from .serializers import NotifSerializer, UserSerializer


class FriendShipConsumer(AsyncJsonWebsocketConsumer):
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
           print('ws connect : ', error);
           await self.close();


    
    async def disconnect(self, close_code):
        username : str = self.user.username
        if username in self.channels:
            del self.channels[username]

    
    async def receive_json(self, text_data):
        try:
            action = text_data["action"]
            friend_id = text_data["friend_id"]
            friend : User = await database_sync_to_async(User.objects.get)(pk=friend_id)


            if action == 'check':
                await self.check_friendship(friend)
            else: 
                await self.set_friendship(friend, action)
        
        except Exception as error:
            print('error : ', error)


    async def set_friendship(self, friend, action):

        if action == 'add':
            try:
                await database_sync_to_async(self.user.add_friend)(friend=friend)
            except Exception as error:
                print('error add: ', error)
        elif action == 'accept':
            try:
                await database_sync_to_async(self.user.accept_friend)(friend=friend)
            except Exception as error:
                print('error accept: ', error)

        elif action == 'remove':
            try:
                await database_sync_to_async(self.user.delete_friend)(friend=friend)
            except Exception as error:
                print('error remove :  ', error)

        elif action == 'block':
            try:
                await database_sync_to_async(self.user.block_friend)(friend=friend)
            except Exception as error:
                print('error block :  ', error)
        
        try:
            target_friend = self.get_channel_by_user(friend.username)
            await self.channel_layer.send(target_friend, {"type": "update"})

            
        except Exception as error:
            print('channel key not found :', error)

        await NotificationConsumer().send_notif_user(friend, self.channel_layer)
        await self.setNotification(friend=friend, action=action)


        await self.check_friendship(friend)
        
    async def setNotification(self, friend, action):
        
        try:
            notif = Notification(user=friend, notifier=self.user, content=action, type='friendShip')
            await database_sync_to_async(notif.save)()
        except Exception as error:
            print('error: ', error)

    async def update(self, event):
        await self.send_json(content={'status': 'update'})
        


    async def check_friendship(self ,friend):
        
        if self.user.pk == friend.pk:
            await self.send_json(content={'status': 'owner'})

        else :
            try:
                friendShip = await database_sync_to_async(self.user.get_friendship)(friend=friend)
                await self.send_json(content={'status': friendShip.status})
                

            except Exception:
                await self.send_json(content={'status': 'not friend'})
            




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
            user = self.user
            action = text_data["action"]
            if action == 'check_nb_notif':
                await self.getNbNotif()
            else:
                await self.getAllNotif()
            
        except Exception as error:
            print('error : ', error)


    async def getNbNotif(self):
        new_notif = await database_sync_to_async(self.user.get_new_Notification)()
        nb_notif = await database_sync_to_async(len)(new_notif)
        await self.send_json(content={'type': 'nb_notif' ,'nb_notif': nb_notif})
    
    async def getAllNotif(self):
        
        allNotification = await database_sync_to_async(self.user.get_all_notif)()

        response = await database_sync_to_async(convertNotification)(allNotification)

        await self.send_json(content={'type': 'all_notif' ,'all_notif': response})

    async def update(self, event):
        await self.send_json(content={'type': 'update'})

    async def send_notif_user(self, user, channel_layer):
        try:
            target_channel = self.get_channel_by_user(user.username)
            await channel_layer.send(target_channel, {"type": "update"})

        except Exception as error:
            print('user key not found : ', error)



def convertNotification(allNotification):

    response = []

    if allNotification.exists():
            for notif in allNotification:
                notifData = dict(NotifSerializer(notif).data)
                response.append(notifData)
    
    return response