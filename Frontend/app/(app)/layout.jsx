"use server";
import SideBar from "./sideBar/SideBar.jsx";
import { UserContextProvider } from "./context.js";
import { fetch_jwt } from "@/Tools/fetch_jwt_server";
import { USER_URL } from "../URLS";
import { redirect } from "next/navigation.js";

export async function fetchUser() {
	const [isOk, status, data] = await fetch_jwt(USER_URL);
	if (!isOk) {
		console.log("error: ", data);
		return false;
	}
	return data;
}

export default async function Layout({ children }) {
	const data = await fetchUser();

	if (!data) {
		redirect("/login"); //for now redirect to login men be3d rendri error
	}
	return (
		<UserContextProvider value={data}>
			<div className="w-full h-full flex">
				<SideBar />
				<main className="bg-[#202020] w-full min-h-screen ml-[80px] [@media(max-width:900px)]:ml-0">
					{children}
				</main>
			</div>
		</UserContextProvider>
	);
}
