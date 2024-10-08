"use client";
import { createContext, useEffect, useState } from "react";
import { getToken } from "../(auth)/AuthTools/tokenManagment";
import Settings from "./settings/Settings";
import { APIs } from "@/Tools/fetch_jwt_client";
import { useWebsocket } from "./hooks/useWebsocket";
import { Loader } from "../Components/Loader";

export const UserContext = createContext();

export const UserContextProvider = ({ children, value, setUpdate }) => {
	const [socket, setSocket] = useState(null);
	const [user, setUser] = useState(value);
	const [settings, setSettings] = useState(false);

	const [ws, isReady] = useWebsocket(APIs.user.notif_ws);

	useEffect(() => {
		setSocket(ws);
	}, [ws]);

	useEffect(() => {
		if (value) setUser(value);
	}, [value]);

	return (
		<>
			{!isReady ? (
				<Loader />
			) : (
				<UserContext.Provider
					value={{
						ws: socket,
						user,
						setUser,
						setSettings,
						setUpdate,
					}}
				>
					{children}
					{settings && <Settings showSettings={setSettings} />}
				</UserContext.Provider>
			)}
		</>
	);
};
