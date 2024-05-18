"use client";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import styles from "./LGame.module.css";
import { BOARDES_URL } from "@/app/URLS";

let xcord = 0;
let ycord = 0;
let player2_y = 0;
let c_com = "black";
let player1_y = 0;
// let id = 0;
export const Youchen = () => {
	const cvs = useRef(null);
	const [socket, setSocket] = useState(null);
	console.log(111111);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8000/ws/game");
		ws.onopen = () => {
			console.log("opened");
			setSocket(ws);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data?.event === "update") {
				xcord = data?.message?.x;
				ycord = data?.message?.y;
				player1_y = data?.message?.user1_y;
				player2_y = data?.message?.user2_y;
			}
			if (data.event == "index_player") console.log(data.index);
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

			// let upKeyPressed2 = false;
			// let downKeyPressed2 = false;

			document.addEventListener("keydown", keyDownHandler);
			document.addEventListener("keyup", keyUpHandler);

			// document.addEventListener("keydown", keyDownHandler2);
			// document.addEventListener("keyup", keyUpHandler2);

			function keyDownHandler(event) {
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
			// function keyDownHandler2(event) {
			// 	if (event.keyCode === 87 && id == 2) {
			// 		upKeyPressed2 = true;
			// 		console.log("event2");
			// 		sendPaddleUpdate2();
			// 	}
			// 	if (event.keyCode === 83 && id == 2) {
			// 		downKeyPressed2 = true;
			// 		console.log("event2");
			// 		sendPaddleUpdate2();
			// 	}
			// 	if (event.keyCode === 38 && id == 2) {
			// 		upKeyPressed2 = true;
			// 		console.log("event2");
			// 		sendPaddleUpdate2();
			// 	}
			// 	if (event.keyCode === 40 && id == 2) {
			// 		downKeyPressed2 = true;
			// 		console.log("event2");
			// 		sendPaddleUpdate2();
			// 	}
			// }

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
			// function keyUpHandler2(event) {
			// 	if (event.keyCode === 87 && id == 2) {
			// 		upKeyPressed2 = false;
			// 		console.log("event2");
			// 		sendPaddleUpdate2();
			// 	}
			// 	if (event.keyCode === 83 && id == 2) {
			// 		downKeyPressed2 = false;
			// 		console.log("event2");
			// 		sendPaddleUpdate2();
			// 	}
			// 	if (event.keyCode === 38 && id == 2) {
			// 		upKeyPressed2 = false;
			// 		console.log("event2");
			// 		sendPaddleUpdate2();
			// 	}
			// 	if (event.keyCode === 40 && id == 2) {
			// 		downKeyPressed2 = false;
			// 		console.log("event2");
			// 		sendPaddleUpdate2();
			// 	}
			// }

			function sendPaddleUpdate() {
				if (socket && socket.readyState === WebSocket.OPEN) {
					socket.send(
						JSON.stringify({
							event: "updatePaddle",
							upKeyPressed: upKeyPressed,
							downKeyPressed: downKeyPressed,
						}),
					);
				}
			}

			// function sendPaddleUpdate2() {
			// 	if (socket && socket.readyState === WebSocket.OPEN) {
			// 		socket.send(
			// 			JSON.stringify({
			// 				event: "updatePaddle2",
			// 				upKeyPressed2: upKeyPressed2,
			// 				downKeyPressed2: downKeyPressed2,
			// 			}),
			// 		);
			// 	}
			// }

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

			function collision(b, p) {
				b.top = b.y - b.radius;
				b.bottom = b.y + b.radius;
				b.left = b.x - b.radius;
				b.right = b.x + b.radius;

				p.top = p.y;
				p.bottom = p.y + p.height;
				p.left = p.x;
				p.right = p.x + p.width;

				return (
					b.right > p.left &&
					b.bottom > p.top &&
					b.left < p.right &&
					b.top < p.bottom
				);
			}
			function render() {
				drawRect(0, 0, canvas.width, canvas.height, "black", 1);
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

			setInterval(() => {
				if (socket && socket.readyState === WebSocket.OPEN) {
					socket.send(
						JSON.stringify({
							event: "resize",

							canvasHeight: canvas.height,
							canvasWidth: canvas.width,
						}),
					);
				}
			}, 1000);

			return () => {
				console.log("getting out");
			};
		}
	}, [socket]);

	return (
		<canvas
			style={{ width: "95%", height: "85%", objectFit: "contain" }}
			ref={cvs}
		></canvas>
	);
};
