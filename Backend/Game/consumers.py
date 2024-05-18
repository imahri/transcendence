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
            "height":1300,
            "width":2560
        }

        self.user1 = {
            "x": 3,
            "y": self.canvas['height'] / 2 - 200 / 2,
            "width": 30,
            "height": 200,
            "color": "red",
            "score": 0,
            "id" : 0
        }

        self.user2 = {
            "x": self.canvas['width'] - 31,
            "y": self.canvas['height'] / 2 - 200 / 2,
            "width": 30,
            "height": 200,
            "color": "red",
            "score": 0,
            "id" : 0
        }
        
        player_side = {
            "name" : 0
        }
        
        self.ball = {
            "x": self.canvas['width'] / 2,
            "y": self.canvas['height'] / 2,
            "radius": 20,
            "speed": 5,
            "velocityX": 5,
            "velocityY": 5,
            "color": "orange",
        }

    upKeyPressed = False
    downKeyPressed = False
    upKeyPressed2 = False
    downKeyPressed2 = False
    i = 0



    def updatePaddlePosition(self):
        self.user2['x'] = self.canvas['width'] - 31
        if (self.upKeyPressed and self.user1['y'] > 0):
            self.user1['y'] -= 10
            self.user2['y'] -= 10
        if (self.downKeyPressed and self.user1['y'] + self.user1['height'] < self.canvas['height']):
            self.user1['y'] += 10
            self.user2['y'] += 10

    def reset_ball(self):
        self.ball['x'] = self.canvas['width'] / 2
        self.ball['y'] = self.canvas['height'] / 2
        self.ball['speed'] = 101
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
            if self.collision(self.user1):
                self.i += 1
                print("Paddle user Collision Detected " + str(self.i))

                collpoint = self.ball['y'] - (self.user1['y'] + self.user1['height'] / 2)
                collpoint = collpoint / (self.user1['height'] / 2)
                angleRad = (collpoint * math.pi) / 4
                direction = 1 if self.ball['x'] < self.canvas['width'] / 2 else -1
                self.ball['velocityX'] = direction * self.ball['speed'] * math.cos(angleRad)
                self.ball['velocityY'] = self.ball['speed'] * math.sin(angleRad)
                self.ball['speed'] += 0.5

        else:
            if self.collision(self.user2):
                print("Paddle user2 Collision Detected")
                collpoint = self.ball['y'] - (self.user2['y'] + self.user2['height'] / 2)
                collpoint = collpoint / (self.user2['height'] / 2)
                angleRad = (collpoint * math.pi) / 4
                direction = 1 if self.ball['x'] < self.canvas['width'] / 2 else -1
                self.ball['velocityX'] = direction * self.ball['speed'] * math.cos(angleRad)
                self.ball['velocityY'] = self.ball['speed'] * math.sin(angleRad)
                self.ball['speed'] += 0.5


# in wich room
def get_player_room(Game, player_name):
    for room in Game:
        if player_name in room[1]:
            return room[0]
    return "Player not found in any room"



# get room index
def get_room_index(Game, room_name):
    for index, room in enumerate(Game):
        if room[0] == room_name:
            return index
    return -1 

# get you a room name
def creat_room_name(nested_list):
    if (len(nested_list) == 0):
        return ("room_name_0")
    else:
        last_room_name = nested_list[-1][0]
        if len(nested_list[-1][1]) < 2:
            return last_room_name
        else:
            num = int(last_room_name[-1])
            num += 1
            room_name = "room_name_" + str(num)
            return room_name



def check_players_status(players):
    return len(players) == 2

def check_nested_players_status(nested_list):
    for index, room in enumerate(nested_list):
        room_name, players = room[0], room[1]
        if not check_players_status(players):
            # print(f"{room_name} needs player")
            return index
    return None

def check_for_game_start(nested_list, name):
    index = check_nested_players_status(nested_list)
    if (index != None):
        nested_list[index][1].append(name + "_2")
        print("><> " + nested_list[index][1][1])
        print(nested_list)
        return True
    else:
        rn = creat_room_name(nested_list)
        nested_list.append([rn,[name + "_1"]])
        print("Room was created succesfully : " + rn)
        print(nested_list[0][1][0])
        return False
        

class GameConsumer(AsyncJsonWebsocketConsumer):
    
    game_room  = []
    game_object  = []
    


    async def connect(self):

        await self.accept()

        

    
        self.room_group_name = creat_room_name(self.game_room)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        
        await self.send_json(content={"type": "Connected"})
        
        if (not check_for_game_start(self.game_room, "imad")):
            self.loba = Game()
            self.game_object.append(self.loba)
            await self.send_json(content={
                'event': 'index_player',
                'index': 1,
            })
        else:
            await self.send_json(content={
                'event': 'index_player',
                'index': 2,
            })
            self.game_task = asyncio.create_task(self.send_ball_coordinates())




    async def receive(self, text_data):
        index = get_room_index(self.game_room,self.room_group_name)
        obg = self.game_object[index]
        data = json.loads(text_data)
        if data.get("event") == "resize":
            obg.canvas['height'] = data.get("canvasHeight")
            obg.canvas['width'] = data.get("canvasWidth")

            
            

        if data.get("event") == "updatePaddle":
            obg.upKeyPressed = data.get("upKeyPressed")
            obg.downKeyPressed = data.get("downKeyPressed")
        
        if data.get("event") == "updatePaddle2":
            obg.upKeyPressed2 = data.get("upKeyPressed2")
            obg.downKeyPressed2 = data.get("downKeyPressed2")
            
            



    async def send_ball_coordinates(self):
        print("allo",file=sys.stderr)
        index = get_room_index(self.game_room, self.room_group_name)
        obg = self.game_object[index]
        while True:
            obg.update_ball()
            
            obg.updatePaddlePosition()
            
            await asyncio.sleep(0.0075)
            
            x = obg.ball['x']
            y = obg.ball['y']
            user1_y = obg.user1['y']
            user2_y = obg.user2['y']

            message = {
                'event': 'update',
                'x': x,
                'y': y,
                "user1_y": user1_y,
                "user2_y": user2_y
            }

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'update',
                    'message': message,
                }
            )

    async def update(self, event):
        message = event['message']
        await self.send_json(content={
            'event': 'update',
            'message': message,
        })

    async def disconnect(self, close_code):
        if hasattr(self, 'game_task'):
            self.game_task.cancel()




