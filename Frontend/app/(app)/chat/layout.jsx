"use client";
import { WsChatProvider } from "./context/context";
import { SideBar } from "./Components/SideBar";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

const ChatLayout = ({ children }) => {
	const showSideBar = usePathname() === "/chat";
	return (
		<WsChatProvider>
			<div
				className={`h-screen [@media(max-width:900px)]:pb-[50px] w-full flex bg-[#202020] ${inter.className}`}
			>
				<SideBar />
				<main
					className={`bg-inherit grow w-full h-screen flex flex-row justify-center items-center  ${showSideBar && "xs:hidden sm:hidden"}`}
				>
					{children}
				</main>
			</div>
		</WsChatProvider>
	);
};
export default ChatLayout;
