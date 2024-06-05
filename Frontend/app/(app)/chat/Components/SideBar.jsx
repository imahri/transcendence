"use client";
import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
import { Separator, Separators } from "./Separator";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { WsChatContext } from "../context/context";
import { useContext } from "react";
import { useConvState } from "../Hooks/useConvState";
import { useConversations } from "../Hooks/useConversations";
import { MicroProfile } from "./MicroProfile";

export function SideBar() {
	const { user, data } = useContext(WsChatContext);
	const [convState, setConvState] = useConvState();
	const router = useRouter();
	const showSideBar = usePathname() === "/chat";
	const _Conversations = useConversations(data.conversations);

	return (
		<>
			<aside
				className={`${showSideBar ? styles.sidebar : styles.sidebar_h}`}
			>
				<Searchbar style_ops="chat" />
				<Separator className={"w-72 h-1"} />
				<Conversations
					_convState={[convState, setConvState]}
					_Conversations={_Conversations}
				/>
				<MicroProfile
					onClick={() => router.push("/profile")}
					user={user}
				/>
			</aside>
			<Separators />
		</>
	);
}
