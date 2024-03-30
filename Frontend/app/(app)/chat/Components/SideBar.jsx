"use client";
import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
import { ConvChatContext } from "../context/context";
import { useConvState } from "../Hooks/useConvState";
import { Separator, Separators } from "./Separator";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";

export function SideBar() {
	const [convState, setConvState] = useConvState();
	console.log(convState);
	return (
		<ConvChatContext.Provider value={[convState, setConvState]}>
			<aside className={styles.sidebar}>
				<Searchbar style_ops="chat" />
				<Separator />
				<Conversations />
				<div className="bg-inherit w-full h-[10%]"></div>
			</aside>
			<Separators />
		</ConvChatContext.Provider>
	);
}
