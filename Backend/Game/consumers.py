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
    def __init__(self, creator):
        self.canvas = {"height": 1300, "width": 2560}
        self.matchs: list[Match]
        self.paused = False
        self.reconnect = False
        self.reconnect_counter = 0
        self.creator: str = creator

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
            "is_connect": False,
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
            "is_connect": False,
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
    p1 = 0
    p2 = 0

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
            if self.uid == 1 and self.p1 == 0:
                self.p1 = 1
                time.sleep(10)
            elif self.uid == 2 and self.p2 == 0:
                self.p2 = 1
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
            self.reset_ball()
            return True
        elif self.ball["x"] + self.ball["radius"] > self.canvas["width"]:
            self.user1["score"] += 1
            self.reset_ball()
            return True
        else:
            return False


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
        return False


# found player in wich room and his position
def find_player_in_game(game, search_string, pis):
    for room in game:
        room_name = room[0]
        items = room[1]
        if search_string in items:
            position = items.index(search_string)
            pis.append(room_name)
            pis.append(position)
            return True
    return False

def find_player_in_gameS(game, search_string, pis):
    for room in game:
        room_name = room[0]
        items = room[1]
        if room_name.startswith("room_name_") and search_string in items:
            position = items.index(search_string)
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
        from Tournament.models import Tournament

        try:
            self.user: User = self.scope["user"]
            if not self.user.is_authenticated:
                raise Exception("Not Authorizer")
            else:
                self.register_channel(self.user.username, self.channel_name)
                await self.accept()
                await self.send_json(content={"type": "Connected"})
                try:
                    [_n] = parse_qs(self.scope["query_string"].decode("utf8")).get(
                        "tournament"
                    )  # type: ignore
                    tournament = await database_sync_to_async(Tournament.objects.get)(
                        name=_n
                    )
                    if not await database_sync_to_async(tournament.is_participant)(self.user):
                        raise Exception("not member of tournament")
                except Exception as error:
                    if str(error) == "not member of tournament":
                        await self.disconnect(None)
                        return
                    tournament = None
                [_mode] = parse_qs(self.scope["query_string"].decode("utf8")).get(
                    "mode", ["Classic"]
                )

                if _mode == "Classic":
                    mode = 0
                elif _mode == "Ranked":
                    mode = 1
                elif _mode == "Tournament":
                    mode = 2
                room_name = parse_qs(self.scope["query_string"].decode("utf8")).get(
                    "room", None
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
                        enemy = await database_sync_to_async(User.objects.get)(
                            username=other_player
                        )
                        self.loba.matchs = await database_sync_to_async(Match.create)(
                            self.user, enemy, mode, tournament
                        )
                        self.loba.user1["user_name"] = self.loba.matchs[0].user.username
                        info1 = await self.loba.matchs[0].user.info_async()
                        self.loba.user1["img"] = info1.profile_img.url
                        self.loba.user2["user_name"] = self.loba.matchs[1].user.username
                        info2 = await self.loba.matchs[1].user.info_async()
                        self.loba.user2["img"] = info2.profile_img.url
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
                        self.task_manager.append(
                            asyncio.create_task(self.send_ball_coordinates())
                        )
                    return
                result = []
                if find_player_in_gameS(self.game_room, self.user.username, result):
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

                    index = get_room_index(self.game_room, self.room_group_name)
                    obg = self.game_object[index]
                    obg.pause = True
                    obg.reconnect = False
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "send_info",
                            "user1": {
                                "username": obg.user1["user_name"],
                                "image": obg.user1["img"],
                            },
                            "user2": {
                                "username": obg.user2["user_name"],
                                "image": obg.user2["img"],
                            },
                        },
                    )
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "goal",
                            "score": {
                                "score1": obg.user1["score"],
                                "score2": obg.user2["score"],
                            },
                        },
                    )
                    xrr = len(self.game_room[index][1])
                    if xrr == 2:
                        await self.shouha()

                else:
                    if not check_for_game_start(self.game_room, self.user.username):
                        self.loba = Game()
                        self.game_object.append(self.loba)
                        await self.send_json(
                            content={
                                "event": "index_player",
                                "index": 1,
                            }
                        )

                    else:
                        index = get_room_index(self.game_room, self.room_group_name)
                        self.loba: Game = self.game_object[index]

                        room = []
                        for [name, players] in self.game_room:
                            if self.room_group_name == name:
                                room = [name, players]
                        [name, players] = room
                        other_player = (
                            players[0]
                            if players[0] != self.user.username
                            else players[1]
                        )

                        user = await database_sync_to_async(User.objects.get)(
                            username=other_player
                        )
                        enemy = self.user
                        self.loba.matchs = await database_sync_to_async(Match.create)(
                            user, enemy, mode, tournament
                        )
                        self.loba.user1["user_name"] = self.loba.matchs[0].user.username
                        info1 = await self.loba.matchs[0].user.info_async()
                        self.loba.user1["img"] = info1.profile_img.url
                        self.loba.user2["user_name"] = self.loba.matchs[1].user.username
                        info2 = await self.loba.matchs[1].user.info_async()
                        self.loba.user2["img"] = info2.profile_img.url

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
            await self.disconnect(None)

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
            obg.pause = True
            obg.uid = data.get("id")

    async def change_state(self, event):
        await self.send_json(
            content={
                "event": "change_state",
                "state": "start",
            }
        )

    async def send_info(self, event):
        user1 = event["user1"]
        user2 = event["user2"]
        await self.send_json(
            content={"event": "send_info", "user1": user1, "user2": user2}
        )

    async def reconnect(self, event):
        await self.send_json(content={"event": "reconnect", "state": "back"})

    async def send_ball_coordinates(self):
        try:
            index = get_room_index(self.game_room, self.room_group_name)
            obg: Game = self.game_object[index]
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send_info",
                    "user1": {
                        "username": obg.user1["user_name"],
                        "image": obg.user1["img"],
                    },
                    "user2": {
                        "username": obg.user2["user_name"],
                        "image": obg.user2["img"],
                    },
                },
            )
            await asyncio.sleep(3)

            while True:
                if not obg.reconnect:
                    if obg.user1["score"] == 5 or obg.user2["score"] == 5:

                        if obg.user1["score"] > obg.user2["score"]:
                            user1_st = "win"
                            user2_st = "lose"
                            user1_earned_exp = 500
                            user2_earned_exp = 10

                        if obg.user1["score"] < obg.user2["score"]:
                            user1_st = "lose"
                            user2_st = "win"
                            user1_earned_exp = 10
                            user2_earned_exp = 500

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
                        [match1, match2] = self.loba.matchs
                        await database_sync_to_async(match1.set_score)(
                            obg.user1["score"], user1_earned_exp
                        )
                        await database_sync_to_async(match2.set_score)(
                            obg.user2["score"], user2_earned_exp
                        )
                        if match1.mode == 2 and match1.tournament:
                            await database_sync_to_async(match1.tournament.next_match)()
                        self.game_room.pop(index)
                        self.game_object.pop(index)
                        break

                    elif obg.update_ball():
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                "type": "goal",
                                "score": {
                                    "score1": obg.user1["score"],
                                    "score2": obg.user2["score"],
                                },
                            },
                        )


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
                    await asyncio.sleep(1)
                    obg.reconnect_counter += 1
                    if obg.reconnect_counter == 5:
                        obg.reconnect_counter = 0
                        checker = []
                        if find_player_in_gameS(self.game_room, self.user.username, checker):
                            found = get_room_index(self.game_room, checker[0])
                            if len(self.game_room[found][1]) == 2:

                                if obg.user1['is_connect'] == True and obg.user2['is_connect'] == True:
                                    stop_game = {"type": "forfeited", "end_it": True, "id": 99}
                                    obg.reconnect = False
                                    await self.channel_layer.group_send(
                                        self.room_group_name,
                                        {
                                            "type": "forfeited",
                                            "message": stop_game,
                                        },
                                    )
                                    self.game_room.pop(found)
                                    self.game_object.pop(found)
                                    break

                                elif obg.user1['is_connect'] == True and obg.user2['is_connect'] == False:
                                    stop_game = {"type": "forfeited", "end_it": True, "id": 1}
                                    [match1, match2] = obg.matchs
                                    obg.user1['score'] = 0
                                    obg.user2['score'] = 5
                                    obg.reconnect = False
                                    
                                    await database_sync_to_async(match1.set_score)(
                                        obg.user1["score"], 10
                                    )
                                    await database_sync_to_async(match2.set_score)(
                                        obg.user2["score"], 500
                                    )
                                    if match1.mode == 2 and match1.tournament:
                                        await database_sync_to_async(match1.tournament.next_match)()
                                    
                                    await self.channel_layer.group_send(
                                        self.room_group_name,
                                        {
                                            "type": "forfeited",
                                            "message": stop_game,
                                        },
                                    )
                                    self.game_room.pop(found)
                                    self.game_object.pop(found)
                                    break

                                elif obg.user2['is_connect'] == True and obg.user1['is_connect'] == False:
                                    stop_game = {"type": "forfeited", "end_it": True, "id": 2}
                                    [match1, match2] = obg.matchs
                                    obg.user1['score'] = 5
                                    obg.user2['score'] = 0
                                    obg.reconnect = False

                                    await database_sync_to_async(match1.set_score)(
                                        obg.user1["score"], 500
                                    )
                                    await database_sync_to_async(match2.set_score)(
                                        obg.user2["score"], 10
                                    )
                                    if match1.mode == 2 and match1.tournament:
                                        await database_sync_to_async(match1.tournament.next_match)()
                                    
                                    await self.channel_layer.group_send(
                                        self.room_group_name,
                                        {
                                            "type": "forfeited",
                                            "message": stop_game,
                                        },
                                    )
                                    self.game_room.pop(found)
                                    self.game_object.pop(found)
                                    break
                        else:
                            stop_game = {"type": "forfeited", "end_it": True, "id": 99}
                            obg.reconnect = False
                            await self.channel_layer.group_send(
                                self.room_group_name,
                                {
                                    "type": "forfeited",
                                    "message": stop_game,
                                },
                            )
                            checker = []
                            find_player_in_game(self.game_room, self.user.username, checker)
                            found = get_room_index(self.game_room, checker[0])
                            self.game_room.pop(found)
                            self.game_object.pop(found)
                            break

        except Exception as error:
            pass

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

    async def forfeited(self, event):
        message = event["message"]
        await self.send_json(
            content={
                "event": "forfeited",
                "message": message,
            }
        )

    async def goal(self, event):
        score = event["score"]
        await self.send_json(
            content={
                "event": "goal",
                "score": score,
            }
        )

    async def disconnect(self, code):
        try:
            self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            index = get_room_index(self.game_room, self.room_group_name)
            obg: Game = self.game_object[index]
            result = []
            if find_player_in_gameS(self.game_room, self.user.username, result):
                if (result[1] + 1) == 1:
                    obg.user1['is_connect'] = True
                else:
                    obg.user2['is_connect'] = True
            obg.reconnect = True
            if len(self.game_room[index][1]) == 1:
                self.game_room.pop(index)
                self.game_object.pop(index)
        except:
            pass
        self.channels.pop(self.user.username, None)
        await self.close(code)



class TournamentConsumer(AsyncJsonWebsocketConsumer):

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
        from Tournament.models import Tournament

        try:
            self.user: User = self.scope["user"]
            if not self.user.is_authenticated:
                raise Exception("Not Authorizer")
            else:
                self.register_channel(self.user.username, self.channel_name)
                await self.accept()
                await self.send_json(content={"type": "Connected"})
                try:
                    [_n] = parse_qs(self.scope["query_string"].decode("utf8")).get(
                        "tournament"
                    )  # type: ignore
                    tournament = await database_sync_to_async(Tournament.objects.get)(
                        name=_n
                    )
                    if not await database_sync_to_async(tournament.is_participant)(self.user):
                        raise Exception("not member of tournament")
                except:
                    await self.disconnect(None)
                    return
                [_mode] = parse_qs(self.scope["query_string"].decode("utf8")).get(
                    "mode", ["Classic"]
                )

                if _mode == "Tournament":
                    mode = 2
                else:
                    raise Exception("only for Tournament")
                room_name = parse_qs(self.scope["query_string"].decode("utf8")).get(
                    "room", None
                )
                if room_name:
                    self.room_group_name = room_name[0]
                else:
                    raise Exception("only for Tournament")
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
                    def im_first() -> bool:
                        try:
                            index = get_room_index(self.game_room, self.room_group_name)
                            self.game_object[index]
                            return True
                        except:
                            return False
                        
                    
                    if not im_first():
                        index = get_room_index(self.game_room, self.room_group_name)
                        if index == -1:
                            return
                        self.loba = Game(creator=self.user.username)
                        self.game_object.append(self.loba)
                        await self.send_json(
                            content={
                                "event": "index_player",
                                "index": 1,
                            }
                        )
                        enemy = await database_sync_to_async(User.objects.get)(
                            username=other_player
                        )
                        self.loba.matchs = await database_sync_to_async(Match.create)(
                            self.user, enemy, mode, tournament
                        )
                        self.loba.user1["user_name"] = self.loba.matchs[0].user.username
                        info1 = await self.loba.matchs[0].user.info_async()
                        self.loba.user1["img"] = info1.profile_img.url
                        self.loba.user2["user_name"] = self.loba.matchs[1].user.username
                        info2 = await self.loba.matchs[1].user.info_async()
                        self.loba.user2["img"] = info2.profile_img.url
                    else:
                        index = get_room_index(self.game_room, self.room_group_name)
                        if index == -1:
                            return
                        self.loba: Game = self.game_object[index]
                        if self.loba.creator == self.user.username:
                            await self.send_json(
                                content={
                                    "event": "index_player",
                                    "index": 1,
                                }
                            )
                            return
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
                    return

        except Exception as error:
            await self.disconnect(None)

    async def receive(self, text_data):

        index = get_room_index(self.game_room, self.room_group_name)
        if index == -1:
            return
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
            obg.pause = True
            obg.uid = data.get("id")

    async def change_state(self, event):
        await self.send_json(
            content={
                "event": "change_state",
                "state": "start",
            }
        )

    async def send_info(self, event):
        user1 = event["user1"]
        user2 = event["user2"]
        await self.send_json(
            content={"event": "send_info", "user1": user1, "user2": user2}
        )

    async def reconnect(self, event):
        await self.send_json(content={"event": "reconnect", "state": "back"})

    async def send_ball_coordinates(self):
        try:
            index = get_room_index(self.game_room, self.room_group_name)
            if index == -1:
                return
            obg: Game = self.game_object[index]
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send_info",
                    "user1": {
                        "username": obg.user1["user_name"],
                        "image": obg.user1["img"],
                    },
                    "user2": {
                        "username": obg.user2["user_name"],
                        "image": obg.user2["img"],
                    },
                },
            )
            await asyncio.sleep(3)

            while True:
                if not obg.reconnect:
                    if obg.user1["score"] == 5 or obg.user2["score"] == 5:

                        if obg.user1["score"] > obg.user2["score"]:
                            user1_st = "win"
                            user2_st = "lose"
                            user1_earned_exp = 500
                            user2_earned_exp = 10

                        if obg.user1["score"] < obg.user2["score"]:
                            user1_st = "lose"
                            user2_st = "win"
                            user1_earned_exp = 10
                            user2_earned_exp = 500

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
                        [match1, match2] = self.loba.matchs
                        await database_sync_to_async(match1.set_score)(
                            obg.user1["score"], user1_earned_exp
                        )
                        await database_sync_to_async(match2.set_score)(
                            obg.user2["score"], user2_earned_exp
                        )
                        if match1.mode == 2 and match1.tournament:
                            await database_sync_to_async(match1.tournament.next_match)()
                        self.game_room.pop(index)
                        self.game_object.pop(index)
                        break

                    elif obg.update_ball():
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                "type": "goal",
                                "score": {
                                    "score1": obg.user1["score"],
                                    "score2": obg.user2["score"],
                                },
                            },
                        )


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
                    await asyncio.sleep(1)
                    checker = []
                    if find_player_in_game(self.game_room, self.user.username, checker):
                        found = get_room_index(self.game_room, checker[0])
                        if len(self.game_room[found][1]) == 2:

                            if obg.user1['is_connect'] == True and obg.user2['is_connect'] == False:
                                stop_game = {"type": "forfeited", "end_it": True, "id": 1}
                                [match1, match2] = obg.matchs
                                obg.user1['score'] = 0
                                obg.user2['score'] = 5
                                obg.reconnect = False
                                
                                await database_sync_to_async(match1.set_score)(
                                    obg.user1["score"], 10
                                )
                                await database_sync_to_async(match2.set_score)(
                                    obg.user2["score"], 500
                                )
                                await database_sync_to_async(match1.tournament.next_match)()
                                
                                await self.channel_layer.group_send(
                                    self.room_group_name,
                                    {
                                        "type": "forfeited",
                                        "message": stop_game,
                                    },
                                )
                                self.game_room.pop(found)
                                self.game_object.pop(found)
                                break

                            else:
                                stop_game = {"type": "forfeited", "end_it": True, "id": 2}
                                [match1, match2] = obg.matchs
                                obg.user1['score'] = 5
                                obg.user2['score'] = 0
                                obg.reconnect = False

                                await database_sync_to_async(match1.set_score)(
                                    obg.user1["score"], 500
                                )
                                await database_sync_to_async(match2.set_score)(
                                    obg.user2["score"], 10
                                )
                                await database_sync_to_async(match1.tournament.next_match)()
                                
                                await self.channel_layer.group_send(
                                    self.room_group_name,
                                    {
                                        "type": "forfeited",
                                        "message": stop_game,
                                    },
                                )
                                self.game_room.pop(found)
                                self.game_object.pop(found)
                                break

        except Exception as error:
            pass

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

    async def forfeited(self, event):
        message = event["message"]
        await self.send_json(
            content={
                "event": "forfeited",
                "message": message,
            }
        )

    async def goal(self, event):
        score = event["score"]
        await self.send_json(
            content={
                "event": "goal",
                "score": score,
            }
        )

    async def disconnect(self, code):
        self.channels.pop(self.user.username, None)
        try:
            self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            index = get_room_index(self.game_room, self.room_group_name)
            if index == -1:
                return
            obg: Game = self.game_object[index]
            result = []
            if find_player_in_game(self.game_room, self.user.username, result):
                if (result[1] + 1) == 1:
                    obg.user1['is_connect'] = True
                else:
                    obg.user2['is_connect'] = True
            obg.reconnect = True
            if len(self.game_room[index][1]) == 1:
                self.game_room.pop(index)
                self.game_object.pop(index)
        except:
            pass
        await self.close(code)


class PrivegameConsumer(AsyncJsonWebsocketConsumer):

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
        from Tournament.models import Tournament

        try:
            self.user: User = self.scope["user"]
            if not self.user.is_authenticated:
                raise Exception("Not Authorizer")
            else:
                self.register_channel(self.user.username, self.channel_name)
                await self.accept()
                await self.send_json(content={"type": "Connected"})
                try:
                    [_n] = parse_qs(self.scope["query_string"].decode("utf8")).get(
                        "tournament"
                    )  # type: ignore
                    tournament = await database_sync_to_async(Tournament.objects.get)(
                        name=_n
                    )
                    if not await database_sync_to_async(tournament.is_participant)(self.user):
                        raise Exception("not member of tournament")
                except Exception as error:
                    if str(error) == "not member of tournament":
                        await self.disconnect(None)
                        return
                    tournament = None
                [_mode] = parse_qs(self.scope["query_string"].decode("utf8")).get(
                    "mode", ["Classic"]
                )

                if _mode == "Classic":
                    mode = 0
                elif _mode == "Ranked":
                    mode = 1
                elif _mode == "Tournament":
                    mode = 2
                room_name = parse_qs(self.scope["query_string"].decode("utf8")).get(
                    "room", None
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
                    def im_first() -> bool:
                        try:
                            index = get_room_index(self.game_room, self.room_group_name)
                            self.game_object[index]
                            return True
                        except:
                            return False
                        
                    
                    if not im_first():
                        index = get_room_index(self.game_room, self.room_group_name)
                        if index == -1:
                            return
                        self.loba = Game(creator=self.user.username)
                        self.game_object.append(self.loba)
                        await self.send_json(
                            content={
                                "event": "index_player",
                                "index": 1,
                            }
                        )
                        enemy = await database_sync_to_async(User.objects.get)(
                            username=other_player
                        )
                        self.loba.matchs = await database_sync_to_async(Match.create)(
                            self.user, enemy, mode, tournament
                        )
                        self.loba.user1["user_name"] = self.loba.matchs[0].user.username
                        info1 = await self.loba.matchs[0].user.info_async()
                        self.loba.user1["img"] = info1.profile_img.url
                        self.loba.user2["user_name"] = self.loba.matchs[1].user.username
                        info2 = await self.loba.matchs[1].user.info_async()
                        self.loba.user2["img"] = info2.profile_img.url
                    else:
                        index = get_room_index(self.game_room, self.room_group_name)
                        if index == -1:
                            return
                        self.loba: Game = self.game_object[index]
                        if self.loba.creator == self.user.username:
                            await self.send_json(
                                content={
                                    "event": "index_player",
                                    "index": 1,
                                }
                            )
                            return
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
                    return



        except Exception as error:
            await self.disconnect(None)

    async def receive(self, text_data):

        index = get_room_index(self.game_room, self.room_group_name)
        if index == -1:
            return
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
            obg.pause = True
            obg.uid = data.get("id")

    async def change_state(self, event):
        await self.send_json(
            content={
                "event": "change_state",
                "state": "start",
            }
        )

    async def send_info(self, event):
        user1 = event["user1"]
        user2 = event["user2"]
        await self.send_json(
            content={"event": "send_info", "user1": user1, "user2": user2}
        )

    async def reconnect(self, event):
        await self.send_json(content={"event": "reconnect", "state": "back"})

    async def send_ball_coordinates(self):
        try:
            index = get_room_index(self.game_room, self.room_group_name)
            if index == -1:
                return
            obg: Game = self.game_object[index]
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send_info",
                    "user1": {
                        "username": obg.user1["user_name"],
                        "image": obg.user1["img"],
                    },
                    "user2": {
                        "username": obg.user2["user_name"],
                        "image": obg.user2["img"],
                    },
                },
            )
            await asyncio.sleep(3)

            while True:
                if not obg.reconnect:
                    if obg.user1["score"] == 5 or obg.user2["score"] == 5:

                        if obg.user1["score"] > obg.user2["score"]:
                            user1_st = "win"
                            user2_st = "lose"
                            user1_earned_exp = 500
                            user2_earned_exp = 10

                        if obg.user1["score"] < obg.user2["score"]:
                            user1_st = "lose"
                            user2_st = "win"
                            user1_earned_exp = 10
                            user2_earned_exp = 500

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
                        [match1, match2] = self.loba.matchs
                        await database_sync_to_async(match1.set_score)(
                            obg.user1["score"], user1_earned_exp
                        )
                        await database_sync_to_async(match2.set_score)(
                            obg.user2["score"], user2_earned_exp
                        )
                        if match1.mode == 2 and match1.tournament:
                            await database_sync_to_async(match1.tournament.next_match)()
                        self.game_room.pop(index)
                        self.game_object.pop(index)
                        break

                    elif obg.update_ball():
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                "type": "goal",
                                "score": {
                                    "score1": obg.user1["score"],
                                    "score2": obg.user2["score"],
                                },
                            },
                        )


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
                    checker = []
                    if find_player_in_game(self.game_room, self.user.username, checker):
                        found = get_room_index(self.game_room, checker[0])
                        if len(self.game_room[found][1]) == 2:

                            if obg.user1['is_connect'] == True and obg.user2['is_connect'] == True:
                                stop_game = {"type": "forfeited", "end_it": True, "id": 99}
                                obg.reconnect = False
                                await self.channel_layer.group_send(
                                    self.room_group_name,
                                    {
                                        "type": "forfeited",
                                        "message": stop_game,
                                    },
                                )
                                self.game_room.pop(found)
                                self.game_object.pop(found)
                                break

                            elif obg.user1['is_connect'] == True and obg.user2['is_connect'] == False:
                                stop_game = {"type": "forfeited", "end_it": True, "id": 1}
                                [match1, match2] = obg.matchs
                                obg.user1['score'] = 0
                                obg.user2['score'] = 5
                                obg.reconnect = False
                                
                                await database_sync_to_async(match1.set_score)(
                                    obg.user1["score"], 10
                                )
                                await database_sync_to_async(match2.set_score)(
                                    obg.user2["score"], 500
                                )
                                if match1.mode == 2 and match1.tournament:
                                    await database_sync_to_async(match1.tournament.next_match)()
                                
                                await self.channel_layer.group_send(
                                    self.room_group_name,
                                    {
                                        "type": "forfeited",
                                        "message": stop_game,
                                    },
                                )
                                self.game_room.pop(found)
                                self.game_object.pop(found)
                                break

                            elif obg.user2['is_connect'] == True and obg.user1['is_connect'] == False:
                                stop_game = {"type": "forfeited", "end_it": True, "id": 2}
                                [match1, match2] = obg.matchs
                                obg.user1['score'] = 5
                                obg.user2['score'] = 0
                                obg.reconnect = False

                                await database_sync_to_async(match1.set_score)(
                                    obg.user1["score"], 500
                                )
                                await database_sync_to_async(match2.set_score)(
                                    obg.user2["score"], 10
                                )
                                if match1.mode == 2 and match1.tournament:
                                    await database_sync_to_async(match1.tournament.next_match)()
                                
                                await self.channel_layer.group_send(
                                    self.room_group_name,
                                    {
                                        "type": "forfeited",
                                        "message": stop_game,
                                    },
                                )
                                self.game_room.pop(found)
                                self.game_object.pop(found)
                                break

        except Exception as error:
            pass

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

    async def forfeited(self, event):
        message = event["message"]
        await self.send_json(
            content={
                "event": "forfeited",
                "message": message,
            }
        )

    async def goal(self, event):
        score = event["score"]
        await self.send_json(
            content={
                "event": "goal",
                "score": score,
            }
        )

    async def disconnect(self, code):
        self.channels.pop(self.user.username, None)
        try:
            self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            index = get_room_index(self.game_room, self.room_group_name)
            if index == -1:
                return
            obg: Game = self.game_object[index]
            result = []
            if find_player_in_game(self.game_room, self.user.username, result):
                if (result[1] + 1) == 1:
                    obg.user1['is_connect'] = True
                else:
                    obg.user2['is_connect'] = True
            obg.reconnect = True
            if len(self.game_room[index][1]) == 1:
                self.game_room.pop(index)
                self.game_object.pop(index)
        except:
            pass
        await self.close(code)