"use client";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import styles from "./LGame.module.css";

let xcord = 0;
let ycord = 0;
let x_com = 0;
let c_com = "black";
let player_y = 0;

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

		// ws.onmessage = (event) => {
		// 	const data = JSON.parse(event.data);
		// 	if (data.event === "update") {
		// 		xcord = data.x;
		// 		ycord = data.y;
		// 		x_com = data.com_x;
		// 	}
		// };

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.event === "update") {
				xcord = data.x; // Keeping 'x' for the ball's x-coordinate
				ycord = data.y; // Keeping 'y' for the ball's y-coordinate
				x_com = data.com_x; // Adjusted variable name for the computer paddle's y-coordinate
				c_com = data.com_c;
				player_y = data.user_y;
				console.log("player_y  ", player_y);
			}
		};

		ws.onerror = () => {
			console.log("error happened");
		};
		ws.onclose = () => {
			console.log("closed");
		};
	}, []);

	useEffect(() => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			const canvas = cvs.current;
			const ctx = canvas.getContext("2d");

			canvas.width = document.documentElement.clientWidth;
			canvas.height = document.documentElement.clientHeight;

			const user = {
				x: 3,
				y: canvas.height / 2 - 200 / 2,
				width: 25,
				height: 200,
				color: "orange",
				score: 0,
			};

			const com = {
				x: canvas.width + 50,
				y: canvas.height / 2 - 200 / 2,
				width: 25,
				height: 200,
				color: "orange",
				score: 0,
			};

			const ball = {
				x: canvas.width / 2,
				y: canvas.height / 2,
				radius: 30,
				speed: 5,
				velocityX: 5,
				velocityY: 5,
				color: "black",
			};

			let upKeyPressed = false;
			let downKeyPressed = false;

			document.addEventListener("keydown", keyDownHandler);
			document.addEventListener("keyup", keyUpHandler);

			function keyDownHandler(event) {
				console.log(event.keyCode);
				if (event.keyCode === 38 || event.keyCode === 87) {
					upKeyPressed = true;
					sendPaddleUpdate();
				} else if (event.keyCode === 40 || event.keyCode === 83) {
					downKeyPressed = true;
					sendPaddleUpdate();
				}
			}

			function keyUpHandler(event) {
				if (event.keyCode === 38 || event.keyCode === 87) {
					upKeyPressed = false;
					sendPaddleUpdate();
				} else if (event.keyCode === 40 || event.keyCode === 83) {
					downKeyPressed = false;
					sendPaddleUpdate();
				}
			}

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

			function render() {
				console.log(c_com);
				drawRect(user.x, player_y, user.width, user.height, user.color);
				drawCircle(xcord, ycord, 20, ball.color);
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

			function game() {
				canvas.width = document.documentElement.clientWidth;
				canvas.height = document.documentElement.clientHeight;
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

							player_x: user.x,
							player_w: user.width,
							player_h: user.height,
							player_c: user.color,

							com_x: com.x,
							com_y: com.y,
							com_c: com.color,
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
		<canvas style={{ height: "100%", width: "100%" }} ref={cvs}></canvas>
	);
};
