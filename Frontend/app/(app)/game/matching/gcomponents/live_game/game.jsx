"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { useSearchParams } from "next/navigation";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";

let xcord = 0;
let ycord = 0;
let player2_y = 0;

let player1_y = 0;

let uid = 0;

let player2_state = "not yet";
let player1_state = "not yet";
let player2_for = "not yet";
let player1_for = "not yet";

export const Gameson = ({
	secondArrived,
	checkWinner,
	checkLoser,
	setScore,
	setPlayer1,
	setPlayer2,
	boardpic,
}) => {
	const cvs = useRef(null);
	const [socket, setSocket] = useState(null);
	const searchParams = useSearchParams();

	useEffect(() => {
		const tournament_name = searchParams.get("tournament");
		const room_name = searchParams.get("room");
		const ws = new WebSocket(
			"ws://localhost:8000/ws/game?" +
				`token=${getToken()}` +
				`${room_name ? `&room=${room_name}` : ""}` +
				`${tournament_name ? `&tournament=${tournament_name}&mode=Tournament` : ""}`,
		);

		ws.onopen = () => {
			setSocket(ws);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.event == "reconnect") {
				secondArrived();
			} else if (data.event == "forfeited") {
				console.log(data);
				player1_for = data?.message?.user1;
				player2_for = data?.message?.user2;
				if (uid == 1 && player1_for === "win") {
					checkWinner();
				}
				if (uid == 2 && player2_for === "win") {
					checkWinner();
				}
				if (uid == 1 && player1_for === "lose") {
					checkLoser();
				}
				if (uid == 2 && player2_for === "lose") {
					checkLoser();
				}
			} else if (data.event == "goal") {
				setScore(data.score);
			} else if (data.event == "send_info") {
				setPlayer1(data.user1);
				setPlayer2(data.user2);
			}

			if (data?.event === "update") {
				xcord = data?.message?.x;
				ycord = data?.message?.y;
				player1_y = data?.message?.user1_y;
				player2_y = data?.message?.user2_y;
			} else if (data.event == "index_player") {
				uid = parseInt(data.index);
			} else if (data.event == "change_state") {
				secondArrived();
			} else if (data.event == "end_game") {
				player1_state = data?.message?.user1;
				player2_state = data?.message?.user2;

				if (uid == 1 && player1_state === "win") {
					checkWinner();
				}
				if (uid == 2 && player2_state === "win") {
					checkWinner();
				}

				if (uid == 1 && player1_state === "lose") {
					checkLoser();
				}
				if (uid == 2 && player2_state === "lose") {
					checkLoser();
				}
			}
		};

		ws.onerror = () => {};

		ws.onclose = () => {};

		return () => {
			ws.close();
			setSocket(null);
		};
	}, []);

	useEffect(() => {
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
					sendPaddleUpdate();
				}
				if (event.keyCode === 83) {
					downKeyPressed = true;
					sendPaddleUpdate();
				}
				if (event.keyCode === 38) {
					upKeyPressed = true;
					sendPaddleUpdate();
				}
				if (event.keyCode === 40) {
					downKeyPressed = true;
					sendPaddleUpdate();
				}
			}

			function keyUpHandler(event) {
				if (event.keyCode === 87) {
					upKeyPressed = false;
					sendPaddleUpdate();
				}
				if (event.keyCode === 83) {
					downKeyPressed = false;
					sendPaddleUpdate();
				}
				if (event.keyCode === 38) {
					upKeyPressed = false;
					sendPaddleUpdate();
				}
				if (event.keyCode === 40) {
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
							id: uid,
						}),
					);
				}
			}

			const togglePause = () => {
				if (socket && socket.readyState === WebSocket.OPEN) {
					socket.send(
						JSON.stringify({ event: "togglePause", id: uid }),
					);
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

			image.src = APIs.image(boardpic);

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

			return () => {};
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
