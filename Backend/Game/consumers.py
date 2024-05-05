from cgitb import text
from email import message
from sys import stderr
from typing import Self
import math
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from User_Management.models import User
import json
import time
import sys
from asgiref.sync import async_to_sync
import asyncio
from concurrent.futures import ThreadPoolExecutor
# create class game
# construct

# ws://localhost:8000/ws/game




class Game:
    def __init__(self):
        # self.downKeyPressed = False
        # self.upKeyPressed = False
  
        self.canvas = {
            "width":1000,
            "height":900
        }
        # self.canvas = {
        #     "width": canvas_width,
        #     "height": canvas_height
        # }

        # self.user = {
        #     "x": 3,
        #     "y": self.canvas['height'] / 2 - 200 / 2,
        #     "width": 25,
        #     "height": 200,
        #     "color": "orange",
        #     "score": 0
        # }
        # self.user1 = {
        #     "x": 3,
        #     "y": self.canvas['height'] / 2 - 200 / 2,
        #     "width": 25,
        #     "height": 200,
        #     "color": "orange",
        #     "score": 0
        # }
        # self.com = {
        #     "x": self.canvas['width'] - 28,
        #     "y": self.canvas['height'] / 2 - 200 / 2,
        #     "width": 25,
        #     "height": 200,
        #     "color": "orange",
        #     "score": 0
        # }
        
        self.ball = {
            "x": self.canvas['width'] / 2,
            "y": self.canvas['height'] / 2,
            "radius": 30,
            "speed": 10,
            "velocityX": 5,
            "velocityY": 5,
            "color": "orange"
        }
        
    # def receive(self, data):
    #     print(data)
        # data_json = json.load(data)
        # resizeh = data_json.get("canvasWidth")
        # resizew = data_json.get("canvasHeight")
        # print("h  " + str(resizeh))
        # print("w  " + str(resizew))
        # print("w  XX")

    # def reset_ball(self):
    #     self.ball['x'] = self.canvas['width'] / 2
    #     self.ball['y'] = self.canvas['height'] / 2
    #     self.ball['speed'] = 10
    #     self.ball['velocityX'] *= -1
        

    # def updatePaddlePosition(self):
    #     if (self.upKeyPressed and self.user['y'] > 0):
    #         self.user['y'] -= 10
    #     if (self.downKeyPressed and self.user['y'] + self.user['height'] < self.canvas['height']):
    #         self.user['y'] += 10


    # def collision(self,ball, user):
    #     bat = self.ball['y'] - self.ball['radius']
    #     bab = self.ball['y'] + self.ball['radius']
    #     bal = self.ball['x'] - self.ball['radius']
    #     bar = self.ball['x'] + self.ball['radius']
        
    #     ut= user['y']
    #     ub = user['y'] + user['height']
    #     ul = user['x']
    #     ur = user['x'] + user['width']
        
    #     return (bat > ul and bab > ut and bal < ur and bat < ub)
    

    def update_ball(self):
        self.ball['x'] += self.ball['velocityX']
        self.ball['y'] += self.ball['velocityY']
        
        if (self.ball['y'] + self.ball['radius'] > self.canvas['height'] or self.ball['y'] - self.ball['radius'] < 0):
            self.ball['velocityY'] *= -1
        if (self.ball['x'] - self.ball['radius'] < 0 or self.ball['x'] + self.ball['radius'] > self.canvas['width']):
            self.ball['velocityX'] *= -1
        
        
        # print("self.ball['x'] >> " + str(self.ball['x']))
        # print("self.ball['y'] >> " + str(self.ball['y']))

            
        
   
        # print("allo")
        # print("self.user['x'] >> " + str(self.user['x']))
        # print("self.user['y'] >> " + str(self.user['y']))
        # print("self.com['x'] >> " + str(self.com['x']))
        # print("self.com['y'] >> " + str(self.com['y']))

        
        # computerLevl = 0.5
        
        # self.com['y'] += (self.ball['y'] - (self.com['y'] + self.com['height'] / 2)) * computerLevl
        
        # if (self.ball['y'] + self.ball['radius'] > self.canvas['height'] or self.ball['y'] - self.ball['radius'] < 0 ):
        #     self.ball['velocityY'] *= -1
            
        # if self.ball['x'] < self.canvas['width'] / 2:
        #     player = self.user
        # else:
        #     player = self.com
        
        # if (self.collision(self.ball,player)):
            
        #     collpoint = self.ball['y'] - (player['y'] + player['height'] / 2)
            
        #     collpoint = collpoint / (player['height'] / 2)
            
        #     angleRad = (collpoint * math.pi) / 4
            
        #     direction = 1 if self.ball['x'] < self.canvas['width'] / 2 else -1
            
        #     self.ball['velocityX'] = direction * self.ball['speed'] * math.cos(angleRad)
            
        #     self.ball['velocityY'] = self.ball['speed'] * math.sin(angleRad)
            
        #     self.ball['speed'] += 0.5



        # if ((self.ball['x'] - self.ball['radius']) < 0):
        #     self.com['score'] += 1
        #     self.reset_ball()
        #     print("com +1 >> " + str(self.com['score']))
        # elif ((self.ball['x'] + self.ball['radius']) > self.canvas['width']):
        #     self.user['score'] += 1
        #     self.reset_ball()
        #     print("user +1 >> " + str(self.user['score']))
                
                


                
                
            
        
            
        

class GameConsumer(AsyncJsonWebsocketConsumer):
    
    
    async def connect(self):
        await self.accept()
        await self.send_json(content={"type": "Connected"})
        self.loba = Game()
        await asyncio.sleep(1)
        self.game_task = asyncio.create_task(self.send_ball_coordinates())
    
    # async def connect(self):
    #     await self.accept()
    #     await self.send_json(content={"type": "Connected"})
    #     canvas_width = 1000  # Default width
    #     canvas_height = 900  # Default height
    #     self.loba = Game(canvas_width, canvas_height)
    #     self.game_task = asyncio.create_task(self.send_ball_coordinates())


    async def receive(self, text_data):
        data = json.loads(text_data)
        self.loba.canvas['height'] = data.get("canvasWidth")
        self.loba.canvas['width'] = data.get("canvasHeight")

    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     canvas_height = data.get("canvasWidth")
    #     canvas_width = data.get("canvasHeight")
    #     self.loba.canvas['height'] = canvas_height
    #     self.loba.canvas['width'] = canvas_width

    async def send_ball_coordinates(self):
        
        while True:
            self.loba.update_ball()
            x = self.loba.ball['x']
            y = self.loba.ball['y']
            await asyncio.sleep(0.0075)
            await self.send_json(content={
                    'event': 'update',
                    'x': y,
                    'y': x
                })
        


        # print(self.loba.canvas['height'])
        # print(self.loba.canvas['width'])
        # self.loba.receive(text_data)
        # self.send_ball_coordinates(text_data)


# class GameConsumer(AsyncJsonWebsocketConsumer):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.loba = Game()
#         self.send_ball_updates = False  # Flag to control sending ball updates

#     async def connect(self):
#         await self.accept()
#         await self.send_json(content={"type": "Connected"})
#         self.send_ball_updates = True  # Set the flag to True


#     async def receive(self, text_data):
#         try:
#             data = json.loads(text_data)
#             if "canvasWidth" in data and "canvasHeight" in data:
#                 self.loba.canvas['width'] = data.get("canvasHeight")
#                 self.loba.canvas['height'] = data.get("canvasWidth")
#                 await self.send_ball_coordinates()
#         except json.JSONDecodeError:
#             pass

#     async def send_ball_coordinates(self):
#         while self.send_ball_updates:
#             self.loba.update_ball()
#             x = self.loba.ball['x']
#             y = self.loba.ball['y']
#             await self.send_json(content={
#                 'event': 'update',
#                 'x': y,
#                 'y': x
#             })
#             await asyncio.sleep(0.0075)

#     async def disconnect(self, close_code):
#         self.send_ball_updates = False