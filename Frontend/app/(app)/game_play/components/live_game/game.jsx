"use client";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";
import styles from "./LGame.module.css";

let xcord = 0;
let ycord = 0;
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
			if (data.event === "update") {
				xcord = data.x;
				ycord = data.y;
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

			const ball = {
				x: canvas.width / 2,
				y: canvas.height / 2,
				radius: 30,
				speed: 20,
				velocityX: 5,
				velocityY: 5,
				color: "orange",
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

			function render() {
				drawCircle(xcord, ycord, 20, "orange");
				drawRect(0, canvas.height / 2 - 200 / 2, 30, 200, "orange");
				drawRect(
					canvas.width - 30,
					canvas.height / 2 - 200 / 2,
					30,
					200,
					"orange",
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
					console.log(canvas.height);
					console.log(canvas.width);
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
		<canvas style={{ height: "100%", width: "100%" }} ref={cvs}></canvas>
	);
};
