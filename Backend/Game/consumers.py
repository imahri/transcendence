from cgitb import text
import collections
from doctest import FAIL_FAST
from email import message
from shutil import which
from sys import stderr
from typing import Self
import math
import venv
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from User_Management.models import User
import json
import time
import sys
from asgiref.sync import async_to_sync
import asyncio
from concurrent.futures import ThreadPoolExecutor
from asyncio.locks import Lock
import random
# create class game
# construct

# ws://localhost:8000/ws/game

class Game:
    def __init__(self):
        self.canvas = {
            "height":1651,
            "width":1110
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
            "x": self.canvas['width'] + 50,
            # "x":  self.canvas['width'] - 31,
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

    upKeyPressed = False
    downKeyPressed = False
    # upKeyPressed1 = False
    # downKeyPressed1 = False
    i = 0



    def updatePaddlePosition(self):
        if (self.upKeyPressed and self.user['y'] > 0):
            self.user['y'] -= 10
            self.com['y'] -= 10
        if (self.downKeyPressed and self.user['y'] + self.user['height'] < self.canvas['height']):
            self.user['y'] += 10
            self.com['y'] += 10
        # if (self.upKeyPressed1 and self.com['y'] > 0):
        #     self.com['y'] -= 10
        # if (self.downKeyPressed1 and self.com['y'] + self.com['height'] < self.canvas['height']):
        #     self.com['y'] += 10



    def reset_ball(self):
        self.ball['x'] = self.canvas['width'] / 2
        self.ball['y'] = self.canvas['height'] / 2
        self.ball['speed'] = 10
        self.ball['velocityX'] *= -1


    def collision(self, player):
        ball_left = self.ball['x'] - self.ball['radius']
        ball_right = self.ball['x'] + self.ball['radius']
        ball_top = self.ball['y'] - self.ball['radius']
        ball_bottom = self.ball['y'] + self.ball['radius']
        
        player_left = player['x']
        player_right = player['x'] + player['width']
        player_top = player['y']
        player_bottom = player['y'] + player['height']
        

        return (ball_right > player_left and ball_left < player_right and 
                ball_bottom > player_top and ball_top < player_bottom)

    def update_ball(self):
        self.ball['x'] += self.ball['velocityX']
        self.ball['y'] += self.ball['velocityY']

        if (self.ball['y'] + self.ball['radius'] >= self.canvas['height'] or self.ball['y'] - self.ball['radius'] <= 0):
            self.ball['velocityY'] *= -1
        if (self.ball['x'] - self.ball['radius'] <= 0 or self.ball['x'] + self.ball['radius'] >= self.canvas['width']):
            self.ball['velocityX'] *= -1

        if (self.ball['x'] < (self.canvas['width'] / 2)):
            if self.collision(self.user):
                self.i += 1
                print("Paddle user Collision Detected " + str(self.i))

                # self.ball['x'] += 28
                collpoint = self.ball['y'] - (self.user['y'] + self.user['height'] / 2)
                collpoint = collpoint / (self.user['height'] / 2)
                angleRad = (collpoint * math.pi) / 4
                direction = 1 if self.ball['x'] < self.canvas['width'] / 2 else -1
                self.ball['velocityX'] = direction * self.ball['speed'] * math.cos(angleRad)
                self.ball['velocityY'] = self.ball['speed'] * math.sin(angleRad)
                self.ball['speed'] += 0.5

        else:
            if self.collision(self.com):
                print("Paddle com Collision Detected")
                collpoint = self.ball['y'] - (self.com['y'] + self.com['height'] / 2)
                collpoint = collpoint / (self.com['height'] / 2)
                angleRad = (collpoint * math.pi) / 4
                direction = 1 if self.ball['x'] < self.canvas['width'] / 2 else -1
                self.ball['velocityX'] = direction * self.ball['speed'] * math.cos(angleRad)
                self.ball['velocityY'] = self.ball['speed'] * math.sin(angleRad)
                self.ball['speed'] += 0.5

        

# def check_players_status(players):
#     return len(players) == 2

# def check_nested_players_status(nested_list):
#     for index, room in enumerate(nested_list):
#         room_name, players = room[0], room[1]
#         if not check_players_status(players):
#             print(f"{room_name} needs player")
#             return index
#     return None

# def check_for_game_start(nested_list, group_name, name):
#     index = check_nested_players_status(nested_list)
#     if (index != None):
#         Game[index][1].append(name)
#     else:
#      Game.append([group_name,[name]])
        

# Game = [["room_name1",["wqwq","wwwq12"]], ["room_name3",["wqmmm",22]]]

# check_for_game_start(Game, "gropXX","imad")

# print(Game)

# ****************

# def check_players_status(liste):
#     return len(liste) == 2
        

# def check_nested_players_status(nested_list):
#     all_pairs_good = all(check_players_status(sublist) for sublist in nested_list)
#     if all_pairs_good:
#         nested_list.append([0])
#         return False
#     else:
#         for index, sublist in enumerate(nested_list):
#             if not check_players_status(sublist):
#                 nested_list[index].append(0)
#         return True

# ****************



def creat_room_name(nested_list):
    if (len(nested_list) == 0):
        return ("room_name_0")
    else:
        num = int(nested_list[-1][0][-1])
        num += 1
        room_name = "room_name_" + str(num)
        return room_name
    


def check_players_status(players):
    return len(players) == 2

def check_nested_players_status(nested_list):
    for index, room in enumerate(nested_list):
        room_name, players = room[0], room[1]
        if not check_players_status(players):
            print(f"{room_name} needs player")
            return index
    return None

def check_for_game_start(nested_list, name):
    index = check_nested_players_status(nested_list)
    if (index != None):
        nested_list[index][1].append(name)
        return True
    else:
        rn = creat_room_name(nested_list)
        nested_list.append([rn,[name]])
        print("Room was created succesfully : " + rn)
        return False

class GameConsumer(AsyncJsonWebsocketConsumer):
    
    game_room  = []
    
    var = random.random()

    var_lock = Lock()

    async def connect(self):

        await self.accept()

        var = random.random()
        self.loba = Game()
        


        if (check_for_game_start(self.game_room,"poo")):
            print("lets' boggy")
            self.room_group_name = creat_room_name(self.game_room)

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.send_json(content={"type": "Connected"})
            await asyncio.sleep(1)
            self.game_task = asyncio.create_task(self.send_ball_coordinates())
        else:
            print("lets' you need more")


    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("event") == "resize":
            self.loba.canvas['height'] = data.get("canvasHeight")
            self.loba.canvas['width'] = data.get("canvasWidth")
            self.loba.user['x'] = data.get("player_x")
            self.loba.user['width'] = data.get("player_w")
            self.loba.user['height'] = data.get("player_h")
            self.loba.user['color'] = data.get("player_c")
            self.loba.com['x'] = data.get("com_x")

            

        if data.get("event") == "updatePaddle":
            self.loba.upKeyPressed = data.get("upKeyPressed")
            self.loba.downKeyPressed = data.get("downKeyPressed")
            
            
            
            

            





    async def send_ball_coordinates(self):
        print("allo",file=sys.stderr)
        while True:
            self.loba.update_ball()
            self.loba.updatePaddlePosition()
            await asyncio.sleep(0.0075)
            x = self.loba.ball['x']
            y = self.loba.ball['y']
            collo = self.loba.com['color']
            user_cy = self.loba.user['y']
            other_y = self.loba.com['y']
            message = {
                'event': 'update',
                'x': x,
                'y': y,
                "y_com": other_y,
                "com_c": collo,
                "user_y": user_cy
            }

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'update',
                    'message': message,
                }
            )
            # await asyncio.sleep(0.023)

    async def update(self, event):
        message = event['message']
        await self.send_json(content={
            'event': 'update',
            'message': message,
        })

    async def disconnect(self, close_code):
        if hasattr(self, 'game_task'):
            self.game_task.cancel()




