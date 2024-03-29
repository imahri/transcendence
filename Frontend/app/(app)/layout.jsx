"use client";
import { useState, createContext, useEffect } from "react";
import SideBar from "./sideBar/SideBar.jsx";
import Settings from "./settings/Settings.jsx";
import layoutUtils from "./layoutUtils.jsx";
import { useRouter } from "next/navigation";

export const UserContext = createContext();

export default function Layout({ children, userData }) {
	const navigate = useRouter();

	const [user, setUser] = useState();
	const [notif, setToastNotif] = useState();
	const [isLoading, setLoading] = useState(true);
	const [settings, setSettings] = useState();

	useEffect(() => {
		layoutUtils(navigate).then((userData) => {
			setUser(userData);
			setLoading(false);
		});
	}, []);

	notif ? console.log("notif : ", notif) : "";
	return (
		<>
			{isLoading ? (
				<div>is Loading .......</div>
			) : (
				<UserContext.Provider value={{ user, setUser, setToastNotif }}>
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
