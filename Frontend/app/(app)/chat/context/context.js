"use client";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { wsChat } from "@/app/URLS";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";

export const WsChatContext = createContext();

export const WsChatProvider = ({ children, conversations }) => {
	// [messageUpdated, setMessageUpdated]
	const messageUpdatedState = useState(false);
	const [socket, setSocket] = useState(null);
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		if (!socket) {
			setSocket(new WebSocket(wsChat + `?token=${getToken()}`));
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
			}}
		>
			{children}
		</WsChatContext.Provider>
	);
};

export const ConvChatContext = createContext();
