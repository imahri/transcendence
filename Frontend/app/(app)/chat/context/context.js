"use client";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { wsChat } from "@/app/URLS";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../../layout";

export const WsChatContext = createContext();

export const WsChatProvider = ({ children, conversations }) => {
	const [socket, setSocket] = useState(null);
	const { user, setUser } = useContext(UserContext);

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
		<WsChatContext.Provider
			value={{ user: user, socket: socket, data: conversations }}
		>
			{children}
		</WsChatContext.Provider>
	);
};

export const ConvChatContext = createContext();
