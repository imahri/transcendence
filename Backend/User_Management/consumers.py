import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from .models import User



class FriendShipConsumer(WebsocketConsumer):
    channels: dict = {}

    @classmethod
    def register_channel(cls, username: str, channel_name: str):
        cls.channels[username] = channel_name

    @classmethod
    def get_channel_by_user(cls, user: str):
        return cls.channels[user]

    def connect(self):
        try:
           self.user: User = self.scope["user"]
           if self.user.is_anonymous:
               raise Exception("Not Authorizer")
           else:
            self.register_channel(self.user.username, self.channel_name)
            self.accept()
        
        except Exception as error:
           print('ws connect : ', error);
           self.close();


    
    def disconnect(self, close_code):
        username : str = self.user.username
        if username in self.channels:
            del self.channels[username]

    
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json["action"]
        friend_id = text_data_json["friend_id"]
        friend : User = User.objects.get(pk=friend_id)


        if action == 'check':
            self.check_friendship(friend)
        else: 
            self.set_friendship(friend, action)



    def set_friendship(self, friend, action):

        if action == 'add':
            try:
                self.user.add_friend(friend=friend)
            except Exception as error:
                print('error add: ', error)
        elif action == 'accept':
            try:
                self.user.accept_friend(friend=friend)
            except Exception as error:
                print('error accept: ', error)

        elif action == 'remove':
            try:
                self.user.delete_friend(friend=friend)
            except Exception as error:
                print('error remove :  ', error)

        elif action == 'block':
            try:
                self.user.block_friend(friend=friend)
            except Exception as error:
                print('error block :  ', error)
        
        try:
            target_friend = self.get_channel_by_user(friend.username)
            async_to_sync(self.channel_layer.send)(target_friend, {"type": "update"})
        except Exception as error:
            print('channel key not found :', error)

        self.check_friendship(friend)
        

    def update(self, event):
        self.send(text_data=json.dumps({'status': 'update'}))
        


    def check_friendship(self ,friend):
        
        if self.user.pk == friend.pk:
            self.send(text_data=json.dumps({'status': 'owner'}))

        else :
            try:
                friendShip = self.user.get_friendship(friend=friend)
                self.send(text_data=json.dumps({'status': friendShip.status}))
                

            except Exception:
                self.send(text_data=json.dumps({'status': 'not friend'}))
            
