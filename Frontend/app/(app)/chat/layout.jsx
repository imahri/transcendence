import { WsChatProvider } from "./context/context";
import styles from "./styles/layout.module.css";
import { SideBar } from "./Components/SideBar/SideBar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default async function ChatLayout({ children }) {
	return (
		<WsChatProvider>
			<div
				className={`h-screen w-full m-0 flex flex-row bg-[#202020] ${inter.className}`}
			>
				<SideBar />
				<main className={styles.main}>{children}</main>
			</div>
		</WsChatProvider>
	);
}
