import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";

function updateStatus(e, setNotif, setnbNotif) {
	const data = JSON.parse(e.data);
	console.log("Received message:", data);

	if (data.type == "all_notif") {
		setNotif(data.all_notif);
		setnbNotif(data.unreaded);
	} else if (data.type == "nb_notif") {
		console.log("recive nb readed notif", data.unreaded);
		setnbNotif(data.unreaded);
	} else {
		setNotif((prev) => {
			if (prev) {
				prev.unshift(data.last_notif);
				return prev;
			} else {
				return data.last_notif;
			}
		});
		setnbNotif((prev) => prev + 1);
	}
}

function getAllNotif(socket) {
	socket.send(
		JSON.stringify({
			action: "all_notif",
		}),
	);
}

export function initSocket(setSocket, setnbNotif, setNotif) {
	try {
		const token = getToken();
		const ws = new WebSocket(`ws://localhost:8000/ws/notif?token=${token}`);
		setSocket(ws);

		ws.onopen = () => {
			getAllNotif(ws);
		};

		ws.onmessage = (e) => {
			updateStatus(e, setNotif, setnbNotif);
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
		ws.onclose = (event) => {
			console.log("WebSocket connection closed:", event.reason);
		};
	} catch (error) {
		console.error("Error creating WebSocket:", error);
	}
}
