"use client";
import { useEffect, useState } from "react";
import ConversationSection from "./Components/Conversations/ConversationSection";
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

function SideBar({ children }) {
	return (
		<aside className={styles.sidebar}>
			<Searchbar />
			<Separator />
			{children}
			{/* <div className="bg-red-800 w-full h-[10%]"></div> */}
		</aside>
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

const conversation_types = ["Friends", "Groups"];

export default function ChatLayout({ children }) {
	const [socket, setSocket] = useState(null);
	const [Conv, setConv] = useState(null);
	const [convType, setConvType] = useState(conversation_types[0]);

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
			<ConvChatContext.Provider value={[Conv, setConv]}>
				<div className="h-screen w-full m-0 flex flex-row bg-[#202020]">
					<SideBar>
						<ConvTypeChatContext.Provider
							value={[convType, setConvType]}
						>
							<ConversationType />
							<Conversations type={convType} />
						</ConvTypeChatContext.Provider>
					</SideBar>
					<Separators />
					<ConversationSection />
					{children}
				</div>
			</ConvChatContext.Provider>
		</WsChatContext.Provider>
	);
}
