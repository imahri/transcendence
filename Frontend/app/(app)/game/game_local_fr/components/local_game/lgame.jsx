"use client";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import styles from "./LGame.module.css";

let xcord = 0;
let ycord = 0;
let x_com = 0;
let c_com = "black";
let gaa = false;

export const Gameson = ({ setPlayerone, setPlayertwo }) => {
	const cvs = useRef(null);

	useEffect(() => {
		const canvas = cvs.current;
		const ctx = canvas.getContext("2d");
		let timeoutId = null;

		canvas.width = document.documentElement.clientWidth;
		canvas.height = document.documentElement.clientHeight;

		const ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: 20,
			speed: 15,
			velocityX: 5,
			velocityY: 5,
			color: "orange",
		};

		const user1 = {
			x: 3,
			y: 0,
			y: canvas.height / 2 - 200 / 2,
			width: 30,
			height: 200,
			// height : canvas.height,
			color: "red",
			score: 0,
		};

		const user2 = {
			x: canvas.width - 31,
			y: canvas.height / 2 - 200 / 2,
			width: 30,
			height: 200,
			color: "orange",
			score: 0,
		};

		let paused = false;
		let upKeyPressed = false;
		let downKeyPressed = false;
		let upKeyPressed1 = false;
		let downKeyPressed1 = false;

		document.addEventListener("keydown", keyDownHandler);
		document.addEventListener("keyup", keyUpHandler);

		function keyDownHandler(event) {
			if (event.keyCode === 87) {
				upKeyPressed = true;
			}
			if (event.keyCode === 83) {
				downKeyPressed = true;
			}
			if (event.keyCode === 38) {
				upKeyPressed1 = true;
			}
			if (event.keyCode === 40) {
				downKeyPressed1 = true;
			}
			if (event.keyCode === 32) {
				paused = !paused;
			}
		}

		function keyUpHandler(event) {
			if (event.keyCode === 87) {
				upKeyPressed = false;
			}
			if (event.keyCode === 83) {
				downKeyPressed = false;
			}
			if (event.keyCode === 38) {
				upKeyPressed1 = false;
			}
			if (event.keyCode === 40) {
				downKeyPressed1 = false;
			}
		}

		function updatePaddlePosition() {
			if (!paused) {
				if (upKeyPressed && user1.y > 0) {
					user1.y -= 20;
				}
				if (downKeyPressed && user1.y + user1.height < canvas.height) {
					user1.y += 20;
				}
				if (upKeyPressed1 && user2.y > 0) {
					user2.y -= 20;
				}
				if (downKeyPressed1 && user2.y + user2.height < canvas.height) {
					user2.y += 20;
				}
			}
		}

		function drawText(text, x, y, color) {
			ctx.fillStyle = color;
			ctx.font = "45px fantasy";
			ctx.fillText(text, x, y);
		}

		function drawRect(x, y, w, h, color, opacity) {
			ctx.globalAlpha = opacity;
			ctx.fillStyle = color;
			ctx.fillRect(x, y, w, h);
			ctx.globalAlpha = 1;
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
			drawRect(
				user1.x,
				user1.y,
				user1.width,
				user1.height,
				user1.color,
				1,
			);
			drawRect(
				user2.x,
				user2.y,
				user2.width,
				user2.height,
				user2.color,
				1,
			);

			drawCircle(ball.x, ball.y, ball.radius, ball.color);
		}

		function resetBall() {
			ball.x = canvas.width / 2;
			ball.y = canvas.height / 2;

			ball.speed = 10;
			ball.velocityX *= -1;
		}

		// function update() {
		// 	ball.x += ball.velocityX;
		// 	ball.y += ball.velocityY;

		// 	if (
		// 		ball.y + ball.radius > canvas.height ||
		// 		ball.y - ball.radius < 0
		// 	) {
		// 		ball.velocityY *= -1;
		// 	}

		// 	let player = ball.x < canvas.width / 2 ? user1 : user2;

		// 	if (collision(ball, player)) {
		// 		let collpoint = ball.y - (player.y + player.height / 2);

		// 		collpoint = collpoint / (player.height / 2);

		// 		let angleRad = (collpoint * Math.PI) / 4;

		// 		let direction = ball.x < canvas.width / 2 ? 1 : -1;

		// 		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		// 		ball.velocityY = ball.speed * Math.sin(angleRad);
		// 		ball.speed += 0.5;
		// 	}
		// 	if (ball.x - ball.radius < 0) {
		// 		user2.score++;
		// 		setPlayerone((prev) => prev + 1);
		// 		resetBall();
		// 	} else if (ball.x + ball.radius > canvas.width) {
		// 		user1.score++;
		// 		setPlayertwo((prev) => prev + 1);
		// 		resetBall();
		// 	}
		// }

		function update() {
			ball.x += ball.velocityX;
			ball.y += ball.velocityY;

			if (
				ball.y + ball.radius > canvas.height ||
				ball.y - ball.radius < 0
			) {
				ball.velocityY *= -1;
			}

			let player = ball.x < canvas.width / 2 ? user1 : user2;

			if (collision(ball, player)) {
				let collpoint = ball.y - (player.y + player.height / 2);

				collpoint = collpoint / (player.height / 2);

				let angleRad = (collpoint * Math.PI) / 4;

				let direction = ball.x < canvas.width / 2 ? 1 : -1;

				ball.velocityX = direction * ball.speed * Math.cos(angleRad);
				ball.velocityY = ball.speed * Math.sin(angleRad);
				ball.speed += 0.5;
			}
			if (ball.x - ball.radius < 0) {
				user2.score++;
				setPlayerone((prev) => prev + 1);
				if (user2.score === 7) {
					pauseGame();
					resetScores();
				} else {
					resetBall();
				}
			} else if (ball.x + ball.radius > canvas.width) {
				user1.score++;
				setPlayertwo((prev) => prev + 1);
				if (user1.score === 7) {
					pauseGame();
					resetScores();
				} else {
					resetBall();
				}
			}
		}

		function game() {
			if (!paused) {
				canvas.width = document.documentElement.clientWidth;
				canvas.height = document.documentElement.clientHeight;
				user2.x = canvas.width - 31;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				window.requestAnimationFrame(game);
				update();
				updatePaddlePosition();
				render();
			} else {
				const text = "Pause";
				drawText(
					text,
					canvas.width / 2 - 60,
					canvas.height / 2,
					"orange",
				);
				timeoutId = setTimeout(game, 300);
			}
		}

		function pauseGame() {
			paused = true;
		}

		function resetScores() {
			user1.score = 0;
			user2.score = 0;
			setPlayerone(0);
			setPlayertwo(0);
		}

		game();

		return () => {
			document.removeEventListener("keydown", keyDownHandler);
			document.removeEventListener("keyup", keyUpHandler);
			clearTimeout(timeoutId);
		};
	}, []);
	return (
		<canvas style={{ height: "100%", width: "100%" }} ref={cvs}></canvas>
	);
};
