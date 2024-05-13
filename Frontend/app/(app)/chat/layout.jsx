import { WsChatProvider } from "./context/context";
import { SideBar } from "./Components/SideBar";
import { Inter } from "next/font/google";
import { fetch_jwt } from "@/Tools/fetch_jwt_server";
import { APIs } from "@/Tools/fetch_jwt_client";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Transcendence | Chat",
};

async function getConversations() {
	const [isOk, status, data] = await fetch_jwt(APIs.chat.conversations, {
		offset: 1,
	});
	if (isOk) return data;
	console.error("Fetch Error:", status);
	return { conversations: [] };
}

export default async function ChatLayout({ children }) {
	const data = await getConversations();
	return (
		<WsChatProvider conversations={data}>
			<div
				className={`h-screen w-full flex bg-[#202020] ${inter.className}`}
			>
				<SideBar />
				<main className="bg-inherit grow w-full h-full flex flex-row justify-center items-center">
					{children}
				</main>
			</div>
		</WsChatProvider>
	);
}
