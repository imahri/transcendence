from typing import Self
import math
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from User_Management.models import User
import json
import time

# create class game
# construct

# ws://localhost:8000/ws/game

class Game:
    def __init__(self):
        self.downKeyPressed = False
        self.upKeyPressed = False
  
        self.canvas = {
            "width":300,
            "height":500
        }
        
        self.user = {
            "x": 3,
            "y": self.canvas['height'] / 2 - 200 / 2,
            "width": 25,
            "height": 200,
            "color": "orange",
            "score": 0
        }
        self.user1 = {
            "x": 3,
            "y": self.canvas['height'] / 2 - 200 / 2,
            "width": 25,
            "height": 200,
            "color": "orange",
            "score": 0
        }
        self.com = {
            "x": self.canvas['width'] - 28,
            "y": self.canvas['height'] / 2 - 200 / 2,
            "width": 25,
            "height": 200,
            "color": "orange",
            "score": 0
        }
        self.ball = {
            "x": self.canvas['width'] / 2,
            "y": self.canvas['height'] / 2,
            "radius": 20,
            "speed": 10,
            "velocityX": 5,
            "velocityY": 5,
            "color": "orange"
        }
        
        

    def reset_ball(self):
        self.ball['x'] = self.canvas['width'] / 2
        self.ball['y'] = self.canvas['height'] / 2
        self.ball['speed'] = 10
        self.ball['velocityX'] *= -1
        

    def updatePaddlePosition(self):
        if (self.upKeyPressed and self.user['y'] > 0):
            self.user['y'] -= 10
        if (self.downKeyPressed and self.user['y'] + self.user['height'] < self.canvas['height']):
            self.user['y'] += 10


    def collision(self,ball, user):
        bat = self.ball['y'] - self.ball['radius']
        bab = self.ball['y'] + self.ball['radius']
        bal = self.ball['x'] - self.ball['radius']
        bar = self.ball['x'] + self.ball['radius']
        
        ut= user['y']
        ub = user['y'] + user['height']
        ul = user['x']
        ur = user['x'] + user['width']
        
        return (bat > ul and bab > ut and bal < ur and bat < ub)
    
    
    def update_ball(self):
        print("allo")
        self.ball['x'] += self.ball['velocityX']
        self.ball['y'] += self.ball['velocityY']
        print("self.ball['x'] >> " + str(self.ball['x']))
        print("self.ball['y'] >> " + str(self.ball['y']))

        
        computerLevl = 0.5
        
        self.com['y'] += (self.ball['y'] - (self.com['y'] + self.com['height'] / 2)) * computerLevl
        
        if (self.ball['y'] + self.ball['radius'] > self.canvas['height'] or self.ball['y'] - self.ball['radius'] < 0 ):
            self.ball['velocityY'] *= -1
            
        if self.ball['x'] < self.canvas['width'] / 2:
            player = self.user
        else:
            player = self.com
        if (self.collision(self.ball,player)):
            
            collpoint = self.ball['y'] - (player['y'] + player['height'] / 2)
            
            collpoint = collpoint / (player['height'] / 2)
            
            angleRad = (collpoint * math.pi) / 4
            
            direction = 1 if self.ball['x'] < self.canvas['width'] / 2 else -1
            
            self.ball['velocityX'] = direction * self.ball['speed'] * math.cos(angleRad)
            
            self.ball['velocityY'] = self.ball['speed'] * math.sin(angleRad)
            
            self.ball['speed'] += 0.5
            
        if ((self.ball['x'] - self.ball['radius']) < 0):
            self.com['score'] += 1
            self.reset_ball()
            print("com +1 >> " + str(self.com['score']))
        elif ((self.ball['x'] + self.ball['radius']) > self.canvas['width']):
            self.user['score'] += 1
            self.reset_ball()
            print("user +1 >> " + str(self.user['score']))
                
                


                
                
            
        
            
        

            
            
            
            
            



class GameConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        # try:
            # self.user: User = self.scope["user"]
            # print(self.user)
            # if self.user.is_anonymous:
            #     raise Exception("Not Authorizer")
            # else:
            #     self.register_channel(self.user.username, self.channel_name)
        await self.accept()
        await self.send_json(content={"type": "Connected"})
        loba = Game()
        while True:
            loba.update_ball()
            loba.updatePaddlePosition()
            time.sleep(0.4)
            
       # except Exception:
        #     await self.close()
            
            
            
