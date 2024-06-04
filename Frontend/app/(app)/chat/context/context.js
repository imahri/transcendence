"use client";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { APIs } from "@/Tools/fetch_jwt_client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { useNotification } from "../Hooks/useNotification";

export const WsChatContext = createContext();

export const WsChatProvider = ({ children, conversations }) => {
	const messageUpdatedState = useState(false);
	const [socket, setSocket] = useState(null);
	const { user } = useContext(UserContext);
	const { sendNotif, addListenerNotif } = useNotification();

	useEffect(() => {
		if (!socket) {
			setSocket(new WebSocket(APIs.chat.ws + `?token=${getToken()}`));
			return;
		}
		socket.onopen = () => console.log("Connected with ws/chat");
		socket.onerror = () => console.log("Error in ws/chat");
		socket.onclose = () => console.log("Disconnected with ws/chat");
		return () => socket.close();
	}, [socket]);

	return (
		<WsChatContext.Provider
			value={{
				user: user,
				socket: socket,
				data: conversations,
				messageUpdatedState: messageUpdatedState,
				sendNotif: sendNotif,
				addListenerNotif: addListenerNotif,
			}}
		>
			{children}
		</WsChatContext.Provider>
	);
};

export const ConvChatContext = createContext();
