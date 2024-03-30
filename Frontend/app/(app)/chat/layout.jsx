import { WsChatProvider } from "./context/context";
import styles from "./styles/layout.module.css";
import { SideBar } from "./Components/SideBar/SideBar";
import { Inter } from "next/font/google";
import { authInit } from "@/app/(auth)/AuthTools/tokenManagment";
import { chatApi } from "@/app/URLS";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Transcendence | Chat",
};

async function getConversations() {
	try {
		const query_params = new URLSearchParams({
			limit: 7,
			offset: 0,
		});
		const res = await fetch(
			chatApi("/conversation", query_params),
			authInit,
		);
		if (!res.ok) throw `${res.status} ${res.statusText}`;
		let data = await res.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Fetch Error:", error);
	}
}

export default async function ChatLayout({ children }) {
	const data = getConversations();
	return (
		<WsChatProvider data={data}>
			<div
				className={`h-screen w-full m-0 flex flex-row bg-[#202020] ${inter.className}`}
			>
				<SideBar />
				<main className={styles.main}>{children}</main>
			</div>
		</WsChatProvider>
	);
}
