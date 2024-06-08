"use client";
import { useContext } from "react";
import { UserContext } from "../../context";

export const useNotification = () => {
	const { ws } = useContext(UserContext);

	const sendNotif = (
		to,
		conversationID,
		message,
		FirstTime = false,
		action = "send_notif",
		type = "C",
	) => {
		ws.send(
			JSON.stringify({
				action: action,
				content: {
					to: to,
					type: type,
					content: {
						conversationID: conversationID,
						FirstTime: FirstTime,
						message: message,
					},
				},
			}),
		);
	};

	const ListenerNotif = (socket, listener) => {
		if (socket)
			socket.onmessage = (e) => {
				const event = JSON.parse(e.data);
				if (event.type == "notification" && event.content.type == "C")
					listener(event.content);
			};
	};

	return {
		sendNotif: sendNotif,
		addListenerNotif: ListenerNotif,
	};
};
