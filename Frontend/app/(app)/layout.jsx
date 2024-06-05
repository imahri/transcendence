"use client";
import SideBar from "./sideBar/SideBar.jsx";
import { UserContextProvider } from "./context.js";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client.js";
import { redirect } from "next/navigation.js";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
	const [data, setData] = useState();
	const [Loading, setisLoading] = useState(true);

	useEffect(() => {
		const getUser = async () => {
			const [isOk, status, data] = await fetch_jwt(APIs.user.user);
			if (!isOk) {
				redirect("/login"); //for now redirect to login men be3d rendri error
				return;
			}
			setData(data);
			setisLoading(false);
		};
		getUser();
	}, []);

	return (
		<>
			{Loading ? (
				<div className="w-screen h-screen bg-[#202020] flex justify-center items-center text-white">
					is Loading ....
				</div>
			) : (
				<UserContextProvider value={data}>
					<div className="w-full h-full flex">
						<SideBar />
						<main className="bg-[#202020] w-full min-h-screen ml-[80px] [@media(max-width:900px)]:ml-0">
							{children}
						</main>
					</div>
				</UserContextProvider>
			)}
		</>
	);
}
