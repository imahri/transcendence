"use client";
import Script from "next/script";
import React, { useEffect, useRef } from "react";
import styles from "./LGame.module.css";

export const Youchen = () => {
	const cvs = useRef(null);

	useEffect(() => {
		const canvas = cvs.current;
		const ctx = canvas.getContext("2d");

		canvas.width = document.documentElement.clientWidth;
		canvas.height = document.documentElement.clientHeight;

		// draw rectangle

		function drawRect(x, y, w, h, color) {
			ctx.fillStyle = color;
			ctx.fillRect(x, y, w, h);
		}

		// draw rectangle

		function drawCircle(x, y, r, color) {
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fill();
		}

		const user = {
			x: 3,
			y: canvas.height / 2 - 200 / 2,
			// y: 0,
			width: 25,
			height: 200,
			color: "orange",
			score: 0,
		};

		const com = {
			x: canvas.width - 28,
			y: canvas.height / 2 - 200 / 2,
			width: 25,
			height: 200,
			color: "orange",
			score: 0,
		};

		const ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: 20,
			speed: 20,
			velocityX: 5,
			velocityY: 5,
			color: "orange",
		};

		// mouves

		let upKeyPressed = false;
		let downKeyPressed = false;

		document.addEventListener("keydown", keyDownHandler);
		document.addEventListener("keyup", keyUpHandler);

		function keyDownHandler(event) {
			console.log(event.keyCode);
			if (event.keyCode === 38) {
				upKeyPressed = true;
				// ws.current.send(JSON.stringify({ message }));
			}
			if (event.keyCode === 87) {
				upKeyPressed = true;
			}
			if (event.keyCode === 40) {
				downKeyPressed = true;
			}
			if (event.keyCode === 83) {
				downKeyPressed = true;
			}
		}

		function keyUpHandler(event) {
			if (event.keyCode === 38) {
				upKeyPressed = false;
			}
			if (event.keyCode === 87) {
				upKeyPressed = false;
			}
			if (event.keyCode === 40) {
				downKeyPressed = false;
			}
			if (event.keyCode === 83) {
				downKeyPressed = false;
			}
		}

		function updatePaddlePosition() {
			if (upKeyPressed && user.y > 0) {
				user.y -= 10;
			}
			if (downKeyPressed && user.y + user.height < canvas.height) {
				user.y += 10;
			}
		}

		function drawText(text, x, y, color) {
			ctx.fillStyle = color;
			ctx.font = "45px fantasy";
			ctx.fillText(text, x, y);
		}

		function movePaddle(evt) {
			let rect = canvas.getBoundingClientRect();
			user.y = evt.clientY - rect.top - user.height / 2;
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
			drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
			drawText(
				com.score,
				(3 * canvas.width) / 4,
				canvas.height / 5,
				"white",
			);

			drawRect(user.x, user.y, user.width, user.height, user.color);
			drawRect(com.x, com.y, com.width, com.height, com.color);

			drawCircle(ball.x, ball.y, ball.radius, ball.color);
		}

		function resetBall() {
			ball.x = canvas.width / 2;
			ball.y = canvas.height / 2;

			ball.speed = 20;
			ball.velocityX *= -1;
		}

		function update() {
			ball.x += ball.velocityX;
			ball.y += ball.velocityY;

			let computerLevel = 0.5;
			com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;

			if (
				ball.y + ball.radius > canvas.height ||
				ball.y - ball.radius < 0
			) {
				ball.velocityY *= -1;
			}

			let player = ball.x < canvas.width / 2 ? user : com;

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
				com.score++;
				resetBall();
			} else if (ball.x + ball.radius > canvas.width) {
				user.score++;
				resetBall();
			}
		}

		function game() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			window.requestAnimationFrame(game);
			render();
			update();
			updatePaddlePosition();
		}

		game();
	}, []);
	return (
		<canvas style={{ height: "100%", width: "100%" }} ref={cvs}></canvas>
	);
};
