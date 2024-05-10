"use client";
import { createContext, useEffect, useState } from "react";
import { getToken } from "../(auth)/AuthTools/tokenManagment";
import Settings from "./settings/Settings";

export const UserContext = createContext();

export const UserContextProvider = ({ children, value }) => {
	const [socket, setSocket] = useState(null);
	const [user, setUser] = useState(value);
	const [settings, setSettings] = useState(false);

	useEffect(() => {
		if (!socket) {
			const ws = new WebSocket(
				"ws://localhost:8000/ws/notif" + `?token=${getToken()}`,
			);
			ws.onopen = () => {
				console.log("ws/notif connection is open");
				setSocket(ws);
			};
			return;
		}
		socket.onclose = () => console.log("Disconnected with ws/notif");
		socket.onerror = () => console.log("Error in ws/notif");
		return () => {
			socket.close();
			setSocket(null);
		};
	}, [socket]);

	return (
		<UserContext.Provider
			value={{ ws: socket, user, setUser, setSettings }}
		>
			{children}
			{settings && <Settings showSettings={setSettings} />}
		</UserContext.Provider>
	);
};
