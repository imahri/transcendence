"use client";
import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { getToken } from "../(auth)/AuthTools/tokenManagment";
import Settings from "./settings/Settings";

export const UserContext = createContext();

export const UserContextProvider = ({ children, value }) => {
	const [socket, setSocket] = useState(false);
	const [user, setUser] = useState(value);
	const [settings, setSettings] = useState(false);

	useLayoutEffect(() => {
		if (!socket) {
			const ws = new WebSocket(
				`ws://localhost:8000/ws/notif?token=${getToken()}`,
			);
			setSocket(ws);
			return;
		}

		return () => {
			socket.close();
			setSocket(false);
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
