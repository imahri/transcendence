"use client";
import { createContext, useEffect, useState } from "react";
import { getToken } from "../(auth)/AuthTools/tokenManagment";
import Settings from "./settings/Settings";
import { APIs } from "@/Tools/fetch_jwt_client";

export const UserContext = createContext();

export const UserContextProvider = ({ children, value }) => {
	const [socket, setSocket] = useState(null);
	const [user, setUser] = useState(value);
	const [settings, setSettings] = useState(false);

	useEffect(() => {
		if (!socket) {
			const ws = new WebSocket(
				`${APIs.user.notif_ws}?token=${getToken()}`,
			);

			ws.onopen = () => {
				console.log("ws/notif connection is open");
				setSocket(ws);
			};

			return;
		}
		return () => {
			socket.close();
			console.log("socket is disconnected");
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
