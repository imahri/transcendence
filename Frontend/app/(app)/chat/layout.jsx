"use client";
import { useEffect, useState } from "react";
import ConversationSection from "./Components/Conversations/ConversationSection";
import SideBar from "./Components/SideBar/SideBar";
import Separator from "./Components/SideBar/Separator";
import { wsChat } from "../../URLS";
import { getToken } from "../../(auth)/AuthTools/tokenManagment";
import { WsChatContext, ConvChatContext } from "./context/context";

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
	const [Conv, setConv] = useState(null);

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
					<SideBar>{children}</SideBar>
					<Separators />
					<ConversationSection />
				</div>
			</ConvChatContext.Provider>
		</WsChatContext.Provider>
	);
}
