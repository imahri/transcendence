import { WsChatProvider } from "./context/context";
import styles from "./styles/layout.module.css";
import { SideBar } from "./Components/SideBar";
import { Inter } from "next/font/google";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Transcendence | Chat",
};

async function getConversations() {
	try {
		const data = fetch_jwt(APIs.chat.conversations, {
			limit: 7,
			offset: 0,
		});
		return data;
	} catch (error) {
		console.error("Fetch Error:", error);
	}
}

export default async function ChatLayout({ children }) {
	const data = await getConversations();
	console.log(data);
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
