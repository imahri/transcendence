"use client";
import { useEffect, useReducer, useState } from "react";
import Separator from "./Components/SideBar/Separator";
import { wsChat } from "../../URLS";
import { getToken } from "../../(auth)/AuthTools/tokenManagment";
import {
	WsChatContext,
	ConvTypeChatContext,
	ConvChatContext,
} from "./context/context";
import ConversationType from "./Components/SideBar/ConversationType";
import Conversations from "./Components/SideBar/Conversations";
import styles from "./styles/layout.module.css";
import { Searchbar } from "@/app/(app)/searchBar/Searchbar";

function SideBar() {
	const [convState, setConvState] = useState({
		type: "Friends",
		current_conv: null,
	});

	return (
		<ConvChatContext.Provider value={[convState, setConvState]}>
			<aside className={styles.sidebar}>
				<Searchbar />
				<Separator />
				<ConversationType />
				{/* <Conversations type={convState.type} /> */}
				{/* <div className="bg-red-800 w-full h-[10%]"></div> */}
			</aside>
			<Separators />
		</ConvChatContext.Provider>
	);
}

function Separators() {
	return (
		<div className="w-1 h-[90%] flex flex-col justify-between">
			<Separator className="w-1 h-[7%] rotate-0" />
			<Separator className="w-1 h-[83%] rotate-0" />
		</div>
	);
}

export default function ChatLayout({ children }) {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (!socket) {
			setSocket(new WebSocket(wsChat + `?token=${getToken()}`));
			console.log("connect with ws/chat");
			return;
		}
		socket.onmessage = (e) => {
			const data = JSON.parse(e.data);
			console.log(e);
			console.log(data);
		};

		return () => {
			socket.close();
			console.log("Disconnect with ws/chat");
		};
	}, [socket]);

	return (
		<WsChatContext.Provider value={socket}>
			<div className="h-screen w-full m-0 flex flex-row bg-[#202020]">
				<SideBar />
				<main className={styles.main}>{children}</main>
			</div>
		</WsChatContext.Provider>
	);
}
