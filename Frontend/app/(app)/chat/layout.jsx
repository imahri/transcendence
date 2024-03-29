import { WsChatProvider } from "./context/context";
import styles from "./styles/layout.module.css";
import { SideBar } from "./Components/SideBar/SideBar";

export default async function ChatLayout({ children }) {
	return (
		<WsChatProvider>
			<div className="h-screen w-full m-0 flex flex-row bg-[#202020]">
				<SideBar />
				<main className={styles.main}>{children}</main>
			</div>
		</WsChatProvider>
	);
}
