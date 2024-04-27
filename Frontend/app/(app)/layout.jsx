"use server";
import SideBar from "./sideBar/SideBar.jsx";
import { UserContextProvider } from "./context.js";
import { fetch_jwt } from "@/Tools/fetch_jwt_server.js";
import { USER_URL } from "../URLS.jsx";

export default async function Layout({ children }) {
	const [isOk, status, data] = await fetch_jwt(USER_URL);

	return (
		<UserContextProvider value={data}>
			<div className="w-full h-full flex">
				<SideBar />
				<main className="bg-[#202020] w-full min-h-screen ml-[80px] [@media(max-width:900px)]:ml-0 [@media(max-width:900px)]:mb-[60px] [@media(max-width:900px)]:pb-[20px]">
					{children}
				</main>
			</div>
		</UserContextProvider>
	);
}
