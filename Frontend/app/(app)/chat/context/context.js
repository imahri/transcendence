"use client";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { wsChat } from "@/app/URLS";
import { createContext, useEffect, useState } from "react";

export const WsChatContext = createContext();

export const WsChatProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (!socket) {
			setSocket(new WebSocket(wsChat + `?token=${getToken()}`));
			console.log("connect with ws/chat");
			return;
		}
		socket.onmessage = (e) => {
			const data = JSON.parse(e.data);
			console.log(e);
			console.log(data);
		};

		return () => {
			socket.close();
			console.log("Disconnect with ws/chat");
		};
	}, [socket]);

	return (
		<WsChatContext.Provider value={socket}>
			{children}
		</WsChatContext.Provider>
	);
};

export const ConvTypeChatContext = createContext();
export const ConvChatContext = createContext();
