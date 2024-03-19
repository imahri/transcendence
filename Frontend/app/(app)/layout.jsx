"use client";
import { useState, createContext, useEffect } from "react";
import SideBar from "./sideBar/SideBar.jsx";
import Settings from "./settings/Settings.jsx";
import layoutUtils from "./layoutUtils.jsx";
import { useRouter } from "next/navigation";

const UserContext = createContext();

export default function Layout({ children }) {
	const [user, setUser] = useState();
	const [settings, setSettings] = useState();
	const active = "home";

	const navigate = useRouter();

	useEffect(() => {
		layoutUtils(navigate, setUser);
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<div className="w-full h-full flex">
				<SideBar active={active} showSettings={setSettings} />

				<div className="bg-[#202020] w-full h-screen ml-[80px] max-[900px]:ml-0 ">
					{children}
				</div>
				{settings && <Settings showSettings={setSettings} />}
			</div>
		</UserContext.Provider>
	);
}
