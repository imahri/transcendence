from cgitb import text
import sys
import math
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from Game.models import Match
from User_Management.models import User
import json
import time
from channels.db import database_sync_to_async
import asyncio
from urllib.parse import parse_qs


class Game:
    def __init__(self):
        self.canvas = {"height": 1300, "width": 2560}
        self.matchs: list[Match]
        self.paused = False
        self.reconnect = False

        self.user1 = {
            "x": 3,
            "y": self.canvas["height"] / 2 - 200 / 2,
            "width": 30,
            "height": 200,
            "color": "red",
            "score": 0,
            "id": 0,
            "img": "",
            "user_name": "",
            "exp": 100,
        }

        self.user2 = {
            "x": self.canvas["width"] - 31,
            "y": self.canvas["height"] / 2 - 200 / 2,
            "width": 30,
            "height": 200,
            "color": "red",
            "score": 0,
            "id": 0,
            "img": "",
            "user_name": "",
            "exp": 100,
        }

        self.ball = {
            "x": self.canvas["width"] / 2,
            "y": self.canvas["height"] / 2,
            "radius": 20,
            "speed": 5,
            "velocityX": 5,
            "velocityY": 5,
            "color": "orange",
        }

    upKeyPressed = False
    downKeyPressed = False
    pause = False
    uid = 0

    def toggle_pause(self):
        self.paused = not self.paused

    def updatePaddlePosition(self):
        if self.uid == 1:
            if self.upKeyPressed and self.user1["y"] > 0:
                self.user1["y"] -= 10

            if (
                self.downKeyPressed
                and self.user1["y"] + self.user1["height"] < self.canvas["height"]
            ):
                self.user1["y"] += 10

        if self.uid == 2:
            if self.upKeyPressed and self.user2["y"] > 0:

                self.user2["y"] -= 10
            if (
                self.downKeyPressed
                and self.user2["y"] + self.user2["height"] < self.canvas["height"]
            ):
                self.user2["y"] += 10

    def reset_ball(self):
        self.ball["x"] = self.canvas["width"] / 2
        self.ball["y"] = self.canvas["height"] / 2
        self.ball["speed"] = 10
        self.ball["velocityX"] *= -1

    def collision(self, player):
        ball_left = self.ball["x"] - self.ball["radius"]
        ball_right = self.ball["x"] + self.ball["radius"]
        ball_top = self.ball["y"] - self.ball["radius"]
        ball_bottom = self.ball["y"] + self.ball["radius"]

        player_left = player["x"]
        player_right = player["x"] + player["width"]
        player_top = player["y"]
        player_bottom = player["y"] + player["height"]

        return (
            ball_right > player_left
            and ball_left < player_right
            and ball_bottom > player_top
            and ball_top < player_bottom
        )

    def update_ball(self):
        if self.pause == True:
            time.sleep(10)
            self.pause = False
        self.ball["x"] += self.ball["velocityX"]
        self.ball["y"] += self.ball["velocityY"]

        if (
            self.ball["y"] + self.ball["radius"] >= self.canvas["height"]
            or self.ball["y"] - self.ball["radius"] <= 0
        ):
            self.ball["velocityY"] *= -1

        if self.ball["x"] < (self.canvas["width"] / 2):
            if self.collision(self.user1):

                collpoint = self.ball["y"] - (
                    self.user1["y"] + self.user1["height"] / 2
                )
                collpoint = collpoint / (self.user1["height"] / 2)
                angleRad = (collpoint * math.pi) / 4
                direction = 1 if self.ball["x"] < self.canvas["width"] / 2 else -1
                self.ball["velocityX"] = (
                    direction * self.ball["speed"] * math.cos(angleRad)
                )
                self.ball["velocityY"] = self.ball["speed"] * math.sin(angleRad)
                self.ball["speed"] += 0.5

        else:
            if self.collision(self.user2):
                collpoint = self.ball["y"] - (
                    self.user2["y"] + self.user2["height"] / 2
                )
                collpoint = collpoint / (self.user2["height"] / 2)
                angleRad = (collpoint * math.pi) / 4
                direction = 1 if self.ball["x"] < self.canvas["width"] / 2 else -1
                self.ball["velocityX"] = (
                    direction * self.ball["speed"] * math.cos(angleRad)
                )
                self.ball["velocityY"] = self.ball["speed"] * math.sin(angleRad)
                self.ball["speed"] += 0.5
        if self.ball["x"] - self.ball["radius"] < 0:
            self.user2["score"] += 1
            print("user2 score >> " + str(self.user2["score"]))
            self.reset_ball()
        elif self.ball["x"] + self.ball["radius"] > self.canvas["width"]:
            self.user1["score"] += 1
            print("user1 score >> " + str(self.user1["score"]))
            self.reset_ball()


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
    if len(nested_list) == 0:
        return "room_name_0"
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
            return index
    return None


def check_for_game_start(nested_list, name):
    index = check_nested_players_status(nested_list)
    if index != None:
        nested_list[index][1].append(name)
        return True
    else:
        rn = creat_room_name(nested_list)
        nested_list.append([rn, [name]])
        print("Room was created succesfully : " + rn)
        return False


# found player in wich room and his position
def find_string_in_game(game, search_string, pis):
    for room in game:
        room_name = room[0]
        items = room[1]
        if search_string in items:
            position = items.index(search_string)
            print("find")
            pis.append(room_name)
            pis.append(position)
            return True
    return False


def remove_room_by_index(game, index):
    if 0 <= index < len(game):
        del game[index]
        return True
    return False


# The function will then update the item at the specified index in the specified room with the new string
def update_item_in_room(game, room_name, index, new_string):
    for room in game:
        if room[0] == room_name:
            if 0 <= index < len(room[1]):
                print(f"room value : {room[0]}")
                room[1][index] = new_string
                return True
            else:
                return False
    return False


def update_room_names(room_name, game):
    for room in game:
        if room[0] == room_name:
            room[1] = [name + "_old" for name in room[1]]
            break


class GameConsumer(AsyncJsonWebsocketConsumer):

    game_room = []
    game_object = []
    channels: dict = {}
    task_manager = []

    @classmethod
    def register_channel(cls, username: str, channel_name: str):
        cls.channels[username] = channel_name

    @classmethod
    def get_channel_by_user(cls, user: str):
        return cls.channels.get(user, None)

    async def shouha(self):
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "reconnect", "state": "back"}
        )

    async def connect(self):
        try:
            self.user: User = self.scope["user"]
            if not self.user.is_authenticated:
                raise Exception("Not Authorizer")
            else:
                self.register_channel(self.user.username, self.channel_name)
                await self.accept()
                await self.send_json(content={"type": "Connected"})

                mode = parse_qs(self.scope["query_string"].decode("utf8")).get("mode")
                room_name = parse_qs(self.scope["query_string"].decode("utf8")).get(
                    "room"
                )
                if room_name:
                    self.room_group_name = room_name[0]
                else:
                    self.room_group_name = creat_room_name(self.game_room)
                await self.channel_layer.group_add(
                    self.room_group_name, self.channel_name
                )
                if room_name:
                    room = []
                    for [name, players] in self.game_room:
                        if room_name[0] == name:
                            room = [name, players]
                    [name, players] = room
                    other_player = (
                        players[0] if players[0] != self.user.username else players[1]
                    )
                    if not self.get_channel_by_user(other_player):
                        self.loba = Game()
                        self.game_object.append(self.loba)
                        await self.send_json(
                            content={
                                "event": "index_player",
                                "index": 1,
                            }
                        )
                        enemy = await database_sync_to_async( User.objects.get)(username=other_player)
                        # current default mode is Classic
                        self.loba.matchs = await database_sync_to_async(Match.create)(
                            self.user, enemy, 0
                        )
                    else:
                        await self.send_json(
                            content={
                                "event": "index_player",
                                "index": 2,
                            }
                        )
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {"type": "change_state", "state": "start"},
                        )
                        index = get_room_index(self.game_room, self.room_group_name)
                        self.loba: Game = self.game_object[index]
                        asyncio.create_task(self.send_ball_coordinates())
                    return
                result = []
                if len(self.game_room) > 0:
                    print("befor")
                    print(self.game_room[0])
                if find_string_in_game(self.game_room, self.user.username, result):
                    is_valid = update_item_in_room(
                        self.game_room, result[0], result[1], self.user.username
                    )
                    await self.channel_layer.group_add(result[0], self.channel_name)
                    await self.send_json(
                        content={
                            "event": "index_player",
                            "index": (result[1] + 1),
                        }
                    )
                    await self.shouha()
                    index = get_room_index(self.game_room, self.room_group_name)
                    obg = self.game_object[index]
                    obg.pause = True
                    obg.reconnect = False
                else:
                    # User 1
                    if not check_for_game_start(self.game_room, self.user.username):
                        self.loba = Game()
                        self.game_object.append(self.loba)
                        await self.send_json(
                            content={
                                "event": "index_player",
                                "index": 1,
                            }
                        )
                        print(self.game_room)
                    # User 2
                    else:
                        print(self.game_room)
                        await self.send_json(
                            content={
                                "event": "index_player",
                                "index": 2,
                            }
                        )
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {"type": "change_state", "state": "start"},
                        )
                        self.task_manager.append(
                            asyncio.create_task(self.send_ball_coordinates())
                        )
        except Exception as error:
            print("================>", error)
            await self.close()

    async def receive(self, text_data):
        index = get_room_index(self.game_room, self.room_group_name)
        obg = self.game_object[index]
        data = json.loads(text_data)
        if data.get("event") == "resize":
            obg.canvas["height"] = data.get("canvasHeight")
            obg.canvas["width"] = data.get("canvasWidth")

        elif data.get("event") == "updatePaddle":
            obg.upKeyPressed = data.get("upKeyPressed")
            obg.downKeyPressed = data.get("downKeyPressed")
            obg.uid = data.get("id")

        elif data.get("event") == "togglePause":
            print("pause")
            obg.pause = True

    async def change_state(self, event):
        await self.send_json(
            content={
                "event": "change_state",
                "state": "start",
            }
        )

    async def reconnect(self, event):
        await self.send_json(content={"event": "reconnect", "state": "back"})

    async def send_ball_coordinates(self):
        index = get_room_index(self.game_room, self.room_group_name)
        obg: Game = self.game_object[index]
        await asyncio.sleep(3)

        while True:
            if not obg.reconnect:
                if obg.user1["score"] == 5 or obg.user2["score"] == 5:

                    if obg.user1["score"] > obg.user2["score"]:
                        user1_st = "win"
                        user2_st = "lose"

                    if obg.user1["score"] < obg.user2["score"]:
                        user1_st = "lose"
                        user2_st = "win"

                    l_w = {
                        "type": "end_game",
                        "user1": user1_st,
                        "user1_res": obg.user1["score"],
                        "user2": user2_st,
                        "user2_res": obg.user2["score"],
                    }

                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "end_game",
                            "message": l_w,
                        },
                    )

                    res = get_player_room(self.game_room, self.user.username)
                    update_room_names(res, self.game_room)
                    print("end_game")
                    [match1, match2] = self.loba.matchs
                    await database_sync_to_async(match1.set_score)(obg.user1["score"])
                    await database_sync_to_async(match2.set_score)(obg.user2["score"])
                    if match1.mode == 2 and match1.tournament:
                        match1.tournament.next_match()
                    break

                obg.update_ball()
                obg.updatePaddlePosition()

                await asyncio.sleep(0.0060)

                x = obg.ball["x"]
                y = obg.ball["y"]
                user1_y = obg.user1["y"]
                user2_y = obg.user2["y"]

                message = {
                    "event": "update",
                    "x": x,
                    "y": y,
                    "user1_y": user1_y,
                    "user2_y": user2_y,
                }

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "update",
                        "message": message,
                    },
                )
            else:
                print("reconect mode")
                await asyncio.sleep(1)

    async def update(self, event):
        message = event["message"]
        await self.send_json(
            content={
                "event": "update",
                "message": message,
            }
        )

    async def end_game(self, event):
        message = event["message"]
        await self.send_json(
            content={
                "event": "end_game",
                "message": message,
            }
        )

    async def disconnect(self, code):
        index = get_room_index(self.game_room, self.room_group_name)
        if index != -1:
            obg: Game = self.game_object[index]
            obg.reconnect = True
        self.channels.pop(self.user.username, None)
        await self.close(code)
