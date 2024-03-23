import json

from channels.generic.websocket import WebsocketConsumer
from .models import User



class FriendShipConsumer(WebsocketConsumer):
    def connect(self):
        try:
           self.user: User = self.scope["user"]
           if self.user.is_anonymous:
               raise Exception("Not Authorizer")
           else:
               self.accept()
        
        except Exception:
           print('exept');
           self.close();


    
    def disconnect(self, close_code):
        pass

    
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
        
        self.check_friendship(friend)
        

        


    def check_friendship(self ,friend):
        


        if self.user.pk == friend:
            self.send(text_data=json.dumps({'status': 'owner'}))

        else :
            try:
                friendShip = self.user.get_friendship(friend=friend)
                self.send(text_data=json.dumps({'status': friendShip.status}))
                

            except Exception:
                self.send(text_data=json.dumps({'status': 'not friend'}))
            
