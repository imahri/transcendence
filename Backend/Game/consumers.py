from cgitb import text
import collections
from doctest import FAIL_FAST
from email import message
from shutil import which
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




# class Game:
#     def __init__(self):
        # self.downKeyPressed = False
        # self.upKeyPressed = False
  
        # self.canvas = {
        #     "width":1000,
        #     "height":900
        # }
        # self.canvas = {
        #     "width": canvas_width,
        #     "height": canvas_height
        # }

        # self.user = {
        #     "x": 3,
        #     "y": self.canvas['height'] / 2 - 200 / 2,
        #     "width": 25,
        #     "height": 200,
        #     "color": "red",
        #     "score": 0
        # }
        # self.com = {
        #     "x": self.canvas['width'] - 30,
        #     "y": self.canvas['height'] / 2 - 200 / 2,
        #     "width": 25,
        #     "height": 200,
        #     "color": "red",
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
        #     "x": 20,
        #     "y": self.canvas['height'] / 2 - 200 / 2,
        #     "width": 30,
        #     "height": 200,
        #     "color": "orange",
        #     "score": 0
        # }
        
        # self.ball = {
        #     "x": self.canvas['width'] / 2,
        #     "y": self.canvas['height'] / 2,
        #     "radius": 30,
        #     "speed": 10,
        #     "velocityX": 5,
        #     "velocityY": 5,
        #     "color": "orange"
        # }
        
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
        
    #     ut = user['y']
    #     ub = user['y'] + user['height']
    #     ul = user['x']
    #     ur = user['x'] + user['width']
        
    #     return (bar > ul and bab > ut and bal < ur and bat < ub)
    

    # def update_ball(self):
        # for testing ball ------------------------------------------------>>----------------
        # self.ball['x'] += self.ball['velocityX']
        # self.ball['y'] += self.ball['velocityY']
        
        # if (self.ball['y'] + self.ball['radius'] > self.canvas['height'] or self.ball['y'] - self.ball['radius'] < 0):
        #     self.ball['velocityY'] *= -1
        # if (self.ball['x'] - self.ball['radius'] < 0 or self.ball['x'] + self.ball['radius'] > self.canvas['width']):
        #     self.ball['velocityX'] *= -1
        # for testing ball ------------------------------------------------>>----------------

        # self.ball['x'] += self.ball['velocityX']
        # self.ball['y'] += self.ball['velocityY']
        
        # computerLevel = 0.5
        # self.com['y'] += (self.ball['y'] - (self.com['y'] + self.com['height']/2)) * computerLevel
        
        # if (self.ball['y'] + self.ball['radius'] > self.canvas['height'] or self.ball['y'] - self.ball['radius'] < 0):
        #     self.ball['velocityY'] *= -1
        # if (self.ball['x'] - self.ball['radius'] < 0 or self.ball['x'] + self.ball['radius'] > self.canvas['width']):
        #     self.ball['velocityX'] *= -1
        
        # print(self.canvas['width'])
        # print(self.canvas['height'])
        
        # midpoint1 = self.canvas['height'] / 2
        # midpoint2 = self.canvas['width'] / 2
        # if self.ball['y'] < midpoint1 and self.ball['x'] < midpoint2:
        #     print("user")
        # else:
        #     print("bot")



        
        # for testing ball ------------------------------------------------>>----------------



        # if (self.collision(self.ball, self.user)):
        #     self.ball['velocityX'] *= -1
        #     self.ball['velocityY'] *= -1
        #     self.ball['speed'] += 0.5
    


        
        

        



                
                


                
                
            

            
        

# class GameConsumer(AsyncJsonWebsocketConsumer):
    
    
#     async def connect(self):
#         await self.accept()
#         await self.send_json(content={"type": "Connected"})
#         self.loba = Game()
#         await asyncio.sleep(2)
#         self.game_task = asyncio.create_task(self.send_ball_coordinates())
    
    # async def connect(self):
    #     await self.accept()
    #     await self.send_json(content={"type": "Connected"})
    #     canvas_width = 1000  # Default width
    #     canvas_height = 900  # Default height
    #     self.loba = Game(canvas_width, canvas_height)
    #     self.game_task = asyncio.create_task(self.send_ball_coordinates())


    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     self.loba.canvas['height'] = data.get("canvasWidth")
    #     self.loba.canvas['width'] = data.get("canvasHeight")
    #     self.loba.user['x'] = data.get("player_x")
    #     self.loba.user['y'] = data.get("player_y")
    #     self.loba.user['width'] = data.get("player_w")
    #     self.loba.user['height'] = data.get("player_h")
    #     self.loba.user['color'] = data.get("player_c")
        
        # self.loba.com['x'] = data.get("com_x")
        # self.loba.com['y'] = data.get("com_y")
        # self.loba.com['width'] = data.get("com_w")
        # self.loba.com['height'] = data.get("com_h")
        # self.loba.com['color'] = data.get("com_c")
        
        # print("com_x " + str(data.get("com_x")))
        # print("com_y " + str(data.get("com_y")))
        # com__X = data.get("com_x")
        # com__Y = data.get("com_y")
        # self.loba.com['x'] = com__X
        # self.loba.com['y'] = com__Y
        # print(self.loba.com['x'])
        # print(self.loba.com['y'])



        # self.loba.com['width'] = data.get("com_w")
        # self.loba.com['height'] = data.get("com_h")
        # self.loba.com['color'] = data.get("com_c")
        # print(str(data.get("player_y")))
        # print("x_ball : " + str(self.loba.ball['x']))

    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     canvas_height = data.get("canvasWidth")
    #     canvas_width = data.get("canvasHeight")
    #     self.loba.canvas['height'] = canvas_height
    #     self.loba.canvas['width'] = canvas_width

    # async def send_ball_coordinates(self):
        
    #     while True:
    #         self.loba.update_ball()
    #         x = self.loba.ball['x']
    #         y = self.loba.ball['y']
    #         by = self.loba.com['y']
    #         await asyncio.sleep(0.0075)
    #         await self.send_json(content={
    #                 'event': 'update',
    #                 'x': y,
    #                 'y': x
    #             })
        


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





        
        
        
        
class Game:
    def __init__(self):
  
        self.canvas = {
            "width":1000,
            "height":900
        }
        self.user = {
            "x": 3,
            "y": self.canvas['height'] / 2 - 200 / 2,
            "width": 25,
            "height": 200,
            "color": "red",
            "score": 0
        }
        self.com = {
            # "x": self.canvas['width'] - 30,
            "x":  self.canvas['width'] - 31,
            "y": self.canvas['height'] / 2 - 200 / 2,
            "width": 25,
            "height": 200,
            "color": "red",
            "score": 0
        }
                
        self.ball = {
            "x": self.canvas['width'] / 2,
            "y": self.canvas['height'] / 2,
            "radius": 30,
            "speed": 5,
            "velocityX": 5,
            "velocityY": 5,
            "color": "orange",
            "name" : "imad"
        }

    def reset_ball(self):
        self.ball['x'] = self.canvas['width'] / 2
        self.ball['y'] = self.canvas['height'] / 2
        self.ball['speed'] = 10
        self.ball['velocityX'] *= -1
        
        
    def collision(self, player):
        # Get the coordinates of the ball and the paddle
        ball_left = self.ball['x'] - self.ball['radius']
        ball_right = self.ball['x'] + self.ball['radius']
        ball_top = self.ball['y'] - self.ball['radius']
        ball_bottom = self.ball['y'] + self.ball['radius']
        
        player_left = player['x']
        player_right = player['x'] + player['width']
        player_top = player['y']
        player_bottom = player['y'] + player['height']
        
        # Check for collision
        return (ball_right >= player_left and ball_left <= player_right and 
                ball_bottom >= player_top and ball_top <= player_bottom)

    def update_ball(self):
        self.ball['x'] += self.ball['velocityX']
        self.ball['y'] += self.ball['velocityY']

        if (self.ball['y'] + self.ball['radius'] >= self.canvas['height'] or self.ball['y'] - self.ball['radius'] <= 0):
            self.ball['velocityY'] *= -1
        if (self.ball['x'] - self.ball['radius'] <= 0 or self.ball['x'] + self.ball['radius'] >= self.canvas['width']):
            self.ball['velocityX'] *= -1

        if (self.ball['x'] < (self.canvas['width'] / 2)):
            if self.collision(self.user):
                print("Paddle user Collision Detected")
                self.ball['velocityX'] *= -1
        else:
            if self.collision(self.com):
                print("Paddle com Collision Detected")
                self.ball['velocityX'] *= -1






    # def collision(self, player):
    #     # Get the coordinates of the ball and the paddle
    #     ball_left = self.ball['x'] - self.ball['radius']
    #     ball_right = self.ball['x'] + self.ball['radius']
    #     ball_top = self.ball['y'] - self.ball['radius']
    #     ball_bottom = self.ball['y'] + self.ball['radius']
        
    #     player_left = player['x']
    #     player_right = player['x'] + player['width']
    #     player_top = player['y']
    #     player_bottom = player['y'] + player['height']
        
    #     # Check for collision
    #     # return (ball_right > player_left and ball_bottom > player_top and ball_left < player_right  and ball_top < player_bottom)
    #     return (ball_right > player_left and ball_left < player_right and 
    #     ball_bottom > player_top and ball_top < player_bottom)

    

    # def update_ball(self):
        
    #     # print("woo")

    #     self.ball['x'] += self.ball['velocityX']
    #     self.ball['y'] += self.ball['velocityY']

    #     if (self.ball['y'] + self.ball['radius'] > self.canvas['height'] or self.ball['y'] - self.ball['radius'] < 0):
    #         self.ball['velocityY'] *= -1
    #     if (self.ball['x'] - self.ball['radius'] < 0 or self.ball['x'] + self.ball['radius'] > self.canvas['width']):
    #         self.ball['velocityX'] *= -1


    #     if (self.ball['x'] < (self.canvas['width'] / 2)):
    #         # player = self.user
    #         if self.collision(self.user):
    #             print("Paddle user Collision Detected")
    #             # time.sleep(.5)
    #             self.ball['velocityX'] *= -1
    #     else:    
    #         # player = self.com
    #         if self.collision(self.com):
    #             print("Paddle com Collision Detected")
    #             self.ball['velocityX'] *= -1
    #             # time.sleep(.5)


        # print("Ball Position:", self.ball['x'], self.ball['y'])
        # print("Computer Paddle Position:", self.com['x'], self.com['y'])



        # Check for collision with computer paddle
        # elif self.collision(self.com):
        #     print("Computer Paddle Collision Detected")
        # Check for collision with top or bottom of canvas
        # elif (self.ball['y'] - self.ball['radius'] <= 0 or 
        #     self.ball['y'] + self.ball['radius'] >= self.canvas['height']):
        #     print("Canvas Collision Detected (Top/Bottom)")
        # else:
        #     print("No Collision Detected")
            
        # if (self.user['score'] == 0):
        # if ( == True):
            
            # self.user['score'] += 1

        
        # if (self.collision(player)):
        #     collision_detected = False
        #     print("allo")
            
        # if collision_detected:
        #     print("Collision detected")


        # if (self.ball['x'] - self.ball['radius'] < 0):
        #     self.com['score'] += 1
        #     print("+1 to computer and the score is : " + str(self.com['score']))

        # elif (self.ball['x'] + self.ball['radius'] > self.canvas['width']):
        #     self.user['score'] += 1
        #     print("+1 to player and the score is : " + str(self.user['score']))
        





class GameConsumer(AsyncJsonWebsocketConsumer):
    
    
    async def connect(self):
        await self.accept()
        await self.send_json(content={"type": "Connected"})
        self.loba = Game()
        await asyncio.sleep(1)
        self.game_task = asyncio.create_task(self.send_ball_coordinates())

    async def receive(self, text_data):
        data = json.loads(text_data)
        self.loba.canvas['height'] = data.get("canvasHeight")
        self.loba.canvas['width'] = data.get("canvasWidth")
        self.loba.user['x'] = data.get("player_x")
        self.loba.user['y'] = data.get("player_y")
        self.loba.user['width'] = data.get("player_w")
        self.loba.user['height'] = data.get("player_h")
        self.loba.user['color'] = data.get("player_c")
        
        self.loba.com['x'] = data.get("com_x")
        self.loba.com['y'] = data.get("com_y")
        # self.loba.com['color'] = data.get("com_c")



    async def send_ball_coordinates(self):
        while True:
            self.loba.update_ball()
            await asyncio.sleep(0.0075)
            x = self.loba.ball['x']
            y = self.loba.ball['y']
            com_x = self.loba.canvas['width'] - (self.loba.com['width'])
            collo = self.loba.com['color']
            # print(collo)
            # com_x = self.loba.com['x']
            await self.send_json(content={
                'event': 'update',
                'x': x,
                'y': y,
                "com_x": com_x,
                "com_c": collo
            })
            
    async def disconnect(self, close_code):
        if hasattr(self, 'game_task'):
            self.game_task.cancel()


