import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";

function updateStatus(e, setStatus, socket, friend_id) {
	const data = JSON.parse(e.data);
	console.log("Received message:", data);
	if (data.status == "update") {
		getStatus(socket, friend_id);
		return;
	}
	setStatus(data.status);
}

function getStatus(socket, friend_id) {
	socket.send(
		JSON.stringify({
			action: "check",
			friend_id: friend_id,
		}),
	);
}

// export function initSocket(setSocket, setStatus, profileUser) {
// 	try {
// 		const token = getToken();
// 		const ws = new WebSocket(`ws://localhost:8000/ws/user?token=${token}`);
// 		setSocket(ws);

// 		ws.onopen = () => {
// 			getStatus(ws, profileUser.id);
// 		};

// 		ws.onmessage = (e) => {
// 			updateStatus(e, setStatus, ws, profileUser.id);
// 		};

// 		ws.onerror = (error) => {
// 			console.error("WebSocket error:", error);
// 		};
// 		ws.onclose = (event) => {
// 			console.log("WebSocket connection closed:", event.reason);
// 		};
// 	} catch (error) {
// 		console.error("Error creating WebSocket:", error);
// 	}
// }

export function initSocket(ws, setStatus, profileUser) {
	try {
		// const token = getToken();
		// const ws = new WebSocket(`ws://localhost:8000/ws/user?token=${token}`);
		// setSocket(ws);

		ws.onopen = () => {
			console.log("opeeen");
			getStatus(ws, profileUser.id);
		};

		ws.onmessage = (e) => {
			console.log("mssg");

			updateStatus(e, setStatus, ws, profileUser.id);
		};

		ws.onerror = (error) => {
			console.log("error");
			console.error("WebSocket error:", error);
		};
		ws.onclose = (event) => {
			console.log("friendship WebSocket closed:", event.reason);
		};
	} catch (error) {
		console.error("Error creating WebSocket:", error);
	}
}
