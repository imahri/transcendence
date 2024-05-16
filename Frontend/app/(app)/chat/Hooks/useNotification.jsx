"use client";
import { useContext, useEffect, useState } from "react";
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

export const useNotification = (initialState = () => {}) => {
	const { ws } = useContext(UserContext);
	const [EventListener, setEventListener] = useState(initialState);

	const listener = (e) => {
		const event = JSON.parse(e.data);
		if (event.type == "notification" && event.content.type == "C")
			EventListener(event.content);
	};

	useEffect(() => {
		if (EventListener == null) return;
		ws.removeEventListener("message", listener);
		ws.addEventListener("message", listener);
		return () => ws.removeEventListener("message", listener);
	}, [EventListener]);

	const sendNotif = (
		to,
		conversationID,
		message,
		FirstTime = false,
		action = "send_notif",
		type = "C",
	) => {
		ws.send({
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
		});
	};

	return {
		sendNotif: sendNotif,
		addListenerNotif: setEventListener,
	};
};
