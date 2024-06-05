import { WsChatProvider } from "./context/context";
import { SideBar } from "./Components/SideBar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Transcendence | Chat",
};

const ChatLayout = async ({ children }) => (
	<WsChatProvider>
		<div
			className={`h-screen [@media(max-width:900px)]:pb-[50px] w-full flex bg-[#202020] ${inter.className}`}
		>
			<SideBar />
			<main className="bg-inherit grow w-full h-full flex flex-row justify-center items-center">
				{children}
			</main>
		</div>
	</WsChatProvider>
);

export default ChatLayout;
