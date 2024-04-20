"use client";
import { useState, createContext, useEffect } from "react";
import SideBar from "./sideBar/SideBar.jsx";
import Settings from "./settings/Settings.jsx";
import layoutUtils from "./layoutUtils.jsx";
import { useRouter } from "next/navigation";
import { getToken } from "../(auth)/AuthTools/tokenManagment.jsx";

export const UserContext = createContext();

export default function Layout({ children }) {
	const navigate = useRouter();

	const [user, setUser] = useState();
	const [isLoading, setLoading] = useState(true);
	const [settings, setSettings] = useState();

	const token = getToken();
	const ws = new WebSocket(`ws://localhost:8000/ws/user?token=${token}`);

	useEffect(() => {
		layoutUtils(navigate).then((userData) => {
			setUser(userData);
			setLoading(false);
		});
	}, []);

	return (
		<>
			{isLoading ? (
				<div>is Loading .......</div>
			) : (
				<UserContext.Provider value={{ user, setUser, ws }}>
					<div className="w-full h-full flex">
						<SideBar showSettings={setSettings} />

						<div className="bg-[#202020] w-full min-h-screen ml-[80px] max-[900px]:ml-0 max-[900px]:mb-[60px] max-[900px]:pb-[20px]">
							{children}
						</div>
						{settings && <Settings showSettings={setSettings} />}
					</div>
				</UserContext.Provider>
			)}
		</>
	);
}
