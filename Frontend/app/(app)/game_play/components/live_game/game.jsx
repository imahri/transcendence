"use client";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import styles from "./LGame.module.css";
import { BOARDES_URL } from "@/app/URLS";

let xcord = 0;
let ycord = 0;
let y_com = 0;
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
			// console.log(data);
			if (data?.event === "update") {
				xcord = data?.message?.x; // Keeping 'x' for the ball's x-coordinate
				ycord = data?.message?.y; // Keeping 'y' for the ball's y-coordinate
				y_com = data?.message?.y_com; // Adjusted variable name for the computer paddle's y-coordinate
				player_y = data?.message?.user_y;
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
		console.log("aaa");
		if (socket && socket.readyState === WebSocket.OPEN) {
			const canvas = cvs.current;
			const ctx = canvas.getContext("2d");

			// 	canvas.width = document.documentElement.clientWidth;
			// 	canvas.height = document.documentElement.clientHeight;

			canvas.width = 2560;
			canvas.height = 1300;

			const user = {
				x: 3,
				y: 0,
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
			// let upKeyPressed1 = false;
			// let downKeyPressed1 = false;

			document.addEventListener("keydown", keyDownHandler);
			document.addEventListener("keyup", keyUpHandler);

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
				drawRect(user.x, player_y, user.width, user.height, user.color);
				drawRect(user1.x, y_com, user1.width, user1.height, "red");
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

							player_x: user.x,
							player_w: user.width,
							player_h: user.height,
							player_c: user.color,

							com_x: user1.x,
							com_y: user1.y,
							com_c: user1.color,
						}),
					);
				}
			}, 1000);

			return () => {
				console.log("getting out");
			};
		}
	}, [socket]);

	// ****************************************************************************************************************

	// export const Youchen = ({ }) => {
	// 	const cvs = useRef(null);

	// 	useEffect(() => {
	// 		const canvas = cvs.current;
	// 		const ctx = canvas.getContext("2d");
	// 		let timeoutId = null;

	// 		canvas.width = 2000;
	// 		canvas.height = 1000;

	// 		const ball = {
	// 			x: canvas.width / 2,
	// 			y: canvas.height / 2,
	// 			radius: 20,
	// 			speed: 15,
	// 			velocityX: 5,
	// 			velocityY: 5,
	// 			color: "orange",
	// 		};

	// 		const user = {
	// 			x: 3,
	// 			y: 0,
	// 			y: canvas.height / 2 - 200 / 2,
	// 			width: 30,
	// 			height: 200,
	// 			color: "orange",
	// 			score: 0,
	// 		};

	// 		const com = {
	// 			x: canvas.width - 31,
	// 			y: canvas.height / 2 - 200 / 2,
	// 			width: 30,
	// 			height: 200,
	// 			color: "orange",
	// 			score: 0,
	// 		};

	// 		let paused = false;
	// 		let upKeyPressed = false;
	// 		let downKeyPressed = false;

	// 		document.addEventListener("keydown", keyDownHandler);
	// 		document.addEventListener("keyup", keyUpHandler);

	// 		function keyDownHandler(event) {
	// 			console.log(event.keyCode);
	// 			if (event.keyCode === 38) {
	// 				upKeyPressed = true;
	// 			}
	// 			if (event.keyCode === 87) {
	// 				upKeyPressed = true;
	// 			}
	// 			if (event.keyCode === 40) {
	// 				downKeyPressed = true;
	// 			}
	// 			if (event.keyCode === 83) {
	// 				downKeyPressed = true;
	// 			}
	// 			if (event.keyCode === 32) {
	// 				paused = !paused;
	// 			}
	// 		}

	// 		function keyUpHandler(event) {
	// 			if (event.keyCode === 38) {
	// 				upKeyPressed = false;
	// 			}
	// 			if (event.keyCode === 87) {
	// 				upKeyPressed = false;
	// 			}
	// 			if (event.keyCode === 40) {
	// 				downKeyPressed = false;
	// 			}
	// 			if (event.keyCode === 83) {
	// 				downKeyPressed = false;
	// 			}
	// 		}

	// 		function updatePaddlePosition() {
	// 			// if (!paused) {
	// 				if (upKeyPressed && user.y > 0) {
	// 					user.y -= 10;
	// 				}
	// 				if (downKeyPressed && user.y + user.height < canvas.height) {
	// 					user.y += 10;
	// 				}
	// 			// }
	// 		}

	// 		function drawText(text, x, y, color) {
	// 			ctx.fillStyle = color;
	// 			ctx.font = "45px fantasy";
	// 			ctx.fillText(text, x, y);
	// 		}

	// 		function drawRect(x, y, w, h, color, opacity) {
	// 			ctx.globalAlpha = opacity;
	// 			ctx.fillStyle = color;
	// 			ctx.fillRect(x, y, w, h);
	// 			ctx.globalAlpha = 1;
	// 		}

	// 		function drawCircle(x, y, r, color) {
	// 			ctx.fillStyle = color;
	// 			ctx.beginPath();
	// 			ctx.arc(x, y, r, 0, Math.PI * 2, false);
	// 			ctx.closePath();
	// 			ctx.fill();
	// 		}

	// 		function collision(b, p) {
	// 			b.top = b.y - b.radius;
	// 			b.bottom = b.y + b.radius;
	// 			b.left = b.x - b.radius;
	// 			b.right = b.x + b.radius;

	// 			p.top = p.y;
	// 			p.bottom = p.y + p.height;
	// 			p.left = p.x;
	// 			p.right = p.x + p.width;

	// 			return (
	// 				b.right > p.left &&
	// 				b.bottom > p.top &&
	// 				b.left < p.right &&
	// 				b.top < p.bottom
	// 			);
	// 		}

	// 		function render() {
	// 			drawRect(0, 0, canvas.width, canvas.height, "black", 1);
	// 			drawRect(user.x, user.y, user.width, user.height, user.color, 1);
	// 			drawRect(com.x, com.y, com.width, com.height, com.color, 1);

	// 			drawCircle(ball.x, ball.y, ball.radius, ball.color);
	// 		}

	// 		function resetBall() {
	// 			ball.x = canvas.width / 2;
	// 			ball.y = canvas.height / 2;

	// 			ball.speed = 10;
	// 			ball.velocityX *= -1;
	// 		}

	// 		function update() {
	// 			ball.x += ball.velocityX;
	// 			ball.y += ball.velocityY;

	// 			let computerLevel = 0.2;
	// 			com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

	// 			if (
	// 				ball.y + ball.radius > canvas.height ||
	// 				ball.y - ball.radius < 0
	// 			) {
	// 				ball.velocityY *= -1;
	// 			}

	// 			let player = ball.x < canvas.width / 2 ? user : com;

	// 			if (collision(ball, player)) {
	// 				let collpoint = ball.y - (player.y + player.height / 2);

	// 				collpoint = collpoint / (player.height / 2);

	// 				let angleRad = (collpoint * Math.PI) / 4;

	// 				let direction = ball.x < canvas.width / 2 ? 1 : -1;

	// 				ball.velocityX = direction * ball.speed * Math.cos(angleRad);
	// 				ball.velocityY = ball.speed * Math.sin(angleRad);
	// 				ball.speed += 0.5;
	// 			}
	// 			if (ball.x - ball.radius < 0) {
	// 				console.log("hereeeeee33eeee");
	// 				com.score++;

	// 				resetBall();
	// 			} else if (ball.x + ball.radius > canvas.width) {
	// 				user.score++;

	// 				resetBall();
	// 			}
	// 		}

	// 		function game() {
	// 			// if (!paused) {
	// 				// canvas.width = document.documentElement.clientWidth;
	// 				// canvas.height = document.documentElement.clientHeight;
	// 				com.x = canvas.width - 31;
	// 				ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 				window.requestAnimationFrame(game);
	// 				render();
	// 				update();
	// 				updatePaddlePosition();
	// 			// } else {
	// 				// const text = "Pause";
	// 				// drawText(
	// 				// 	text,
	// 				// 	canvas.width / 2 - 60,
	// 				// 	canvas.height / 2,
	// 				// 	"orange",
	// 				// );
	// 				// timeoutId = setTimeout(game, 300);
	// 			// }
	// 		}

	// 		game();
	// 		// const framePerSecond = 50;
	// 		// setInterval(game, 1000/framePerSecond);

	// 	}, []);
	// ****************************************************************************************************************
	return (
		<canvas
			style={{ width: "95%", height: "85%", objectFit: "contain" }}
			ref={cvs}
		></canvas>
	);
};
