"use client";
import React, { useEffect, useRef, useState } from "react";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import bg from "./borad2.jpg";

let xcord = 0;
let ycord = 0;
let player2_y = 0;

let player1_y = 0;

let uid = 0;

let player2_state = "not yet";
let player1_state = "not yet";

export const Gameson = ({ secondArrived }) => {
	const cvs = useRef(null);
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const ws = new WebSocket(
			"ws://localhost:8000/ws/game?" + `token=${getToken()}`,
		);

		ws.onopen = () => {
			console.log("opened");
			setSocket(ws);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.event == "reconnect") {
				console.log("reconnect");
				secondArrived();
			}

			if (data?.event === "update") {
				xcord = data?.message?.x;
				ycord = data?.message?.y;
				player1_y = data?.message?.user1_y;
				player2_y = data?.message?.user2_y;
			} else if (data.event == "index_player") {
				uid = parseInt(data.index);
				console.log(">>>>  ", uid);
			} else if (data.event == "change_state") {
				console.log("second arrived");
				secondArrived();
			} else if (data.event == "end_game") {
				console.log("game_finish");

				player1_state = data?.message?.user1;
				player2_state = data?.message?.user2;

				if (uid == 1 && player1_state === "win") console.log("win");
				if (uid == 2 && player2_state === "win") console.log("win");

				if (uid == 1 && player1_state === "lose") console.log("lose");
				if (uid == 2 && player2_state === "lose") console.log("lose");
			}
		};

		ws.onerror = () => {
			console.log("error happened");
		};

		ws.onclose = () => {
			console.log("closed");
		};

		return () => {
			ws.close;
		};
	}, []);

	useEffect(() => {
		console.log("aaa");
		if (socket && socket.readyState === WebSocket.OPEN) {
			const canvas = cvs.current;
			const ctx = canvas.getContext("2d");

			canvas.width = 2560;
			canvas.height = 1300;

			const user = {
				x: 3,
				y: canvas.height / 2 - 200 / 2,
				width: 30,
				height: 200,
				color: "orange",
				score: 0,
			};

			const user1 = {
				x: canvas.width - 31,
				y: canvas.height / 2 - 200 / 2,
				width: 30,
				height: 200,
				color: "orange",
				score: 0,
			};

			const ball = {
				x: canvas.width / 2,
				y: canvas.height / 2,
				radius: 20,
				speed: 15,
				velocityX: 5,
				velocityY: 5,
				color: "orange",
			};

			let upKeyPressed = false;
			let downKeyPressed = false;

			document.addEventListener("keydown", keyDownHandler);
			document.addEventListener("keyup", keyUpHandler);

			function keyDownHandler(event) {
				if (event.keyCode === 32) {
					togglePause();
				}
				if (event.keyCode === 87) {
					upKeyPressed = true;
					console.log("event");
					sendPaddleUpdate();
				}
				if (event.keyCode === 83) {
					downKeyPressed = true;
					console.log("event");
					sendPaddleUpdate();
				}
				if (event.keyCode === 38) {
					upKeyPressed = true;
					console.log("event");
					sendPaddleUpdate();
				}
				if (event.keyCode === 40) {
					downKeyPressed = true;
					console.log("event");
					sendPaddleUpdate();
				}
			}

			function keyUpHandler(event) {
				if (event.keyCode === 87) {
					upKeyPressed = false;
					console.log("event");
					sendPaddleUpdate();
				}
				if (event.keyCode === 83) {
					downKeyPressed = false;
					console.log("event");
					sendPaddleUpdate();
				}
				if (event.keyCode === 38) {
					upKeyPressed = false;
					console.log("event");
					sendPaddleUpdate();
				}
				if (event.keyCode === 40) {
					downKeyPressed = false;
					console.log("event");
					sendPaddleUpdate();
				}
			}

			function sendPaddleUpdate() {
				console.log(typeof uid);
				if (socket && socket.readyState === WebSocket.OPEN) {
					socket.send(
						JSON.stringify({
							event: "updatePaddle",
							upKeyPressed: upKeyPressed,
							downKeyPressed: downKeyPressed,
							id: uid,
						}),
					);
				}
			}

			const togglePause = () => {
				if (socket && socket.readyState === WebSocket.OPEN) {
					socket.send(JSON.stringify({ event: "togglePause" }));
				}
			};

			function drawRect(x, y, w, h, color) {
				ctx.fillStyle = color;
				ctx.fillRect(x, y, w, h);
			}

			function drawCircle(x, y, r, color) {
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.PI * 2, false);
				ctx.closePath();
				ctx.fill();
			}

			const image = new Image(60, 45);
			image.onload = drawImageActualSize;
			image.src = bg.src;

			function drawImageActualSize() {
				ctx.drawImage(image, 0, 0, 2560, 1300);
			}

			function render() {
				drawImageActualSize();
				drawRect(
					user.x,
					player1_y,
					user.width,
					user.height,
					user.color,
				);
				drawRect(user1.x, player2_y, user1.width, user1.height, "red");
				drawCircle(xcord, ycord, 20, ball.color);
			}

			function game() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				window.requestAnimationFrame(game);
				render();
			}

			game();

			// setInterval(() => {
			// 	if (socket && socket.readyState === WebSocket.OPEN) {
			// 		socket.send(
			// 			JSON.stringify({
			// 				event: "resize",

			// 				canvasHeight: canvas.height,
			// 				canvasWidth: canvas.width,
			// 			}),
			// 		);
			// 	}
			// }, 1000);

			return () => {
				console.log("getting out");
			};
		}
	}, [socket]);

	return (
		<canvas
			style={{
				width: "100%",
				height: "100%",
				objectFit: "contain",
			}}
			ref={cvs}
		></canvas>
	);
};
