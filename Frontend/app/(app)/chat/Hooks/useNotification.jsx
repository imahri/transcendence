"use client";
import { useContext } from "react";
import { UserContext } from "../../context";

/*
        event.type == "notification" && event.content.type == "C"

        {
            "id": 4,
            "user": {
                "id": 8,
                "email": "testuser@gmail.com",
                "username": "testuser",
                "first_name": "testuser",
                "last_name": "testuser",
                "img": "http://localhost:8000/user/image?path=/default/default.png",
                "is_2FA_active": false
            },
            "type": "C",
            "time": "2024-05-15T14:48:48.292680Z",
            "content": {
                "conversationID": 1,
                "message": "hello"
            },
            "is_read": false,
            "is_hidden": false
        }
*/

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
			socket.addEventListener("message", (e) => {
				const event = JSON.parse(e.data);
				console.log("Notification:", event);
				if (event.type == "notification" && event.content.type == "C")
					listener(event.content);
			});
	};

	return {
		sendNotif: sendNotif,
		addListenerNotif: ListenerNotif,
	};
};
