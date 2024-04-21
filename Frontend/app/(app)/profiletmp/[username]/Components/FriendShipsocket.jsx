import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";

export function updateStatus(e, setStatus, socket, friend_id) {
	const data = JSON.parse(e.data);
	console.log("Received message:", data);
	if (data.status == "update") {
		getStatus(socket, friend_id);
		return;
	}
	setStatus(data.status);
}

export function getStatus(socket, friend_id) {
	socket.send(
		JSON.stringify({
			action: "check",
			friend_id: friend_id,
		}),
	);
}
