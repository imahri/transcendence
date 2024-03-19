"use client";
// import { useEffect, useRef, useState } from "react";
// import ConversationSection from "./Components/Conversations/ConversationSection";
// import SideBar from "./Components/SideBar/SideBar";
// import Separator from "./Components/SideBar/Separator";
// import { wsChat } from "../URLS";
// import { getToken } from "../Auth/AuthTools/tokenManagment";
// import { WsChatContext } from "../Context.jsx/WsChatContext";

// function Separators() {
// 	return (
// 		<div className="w-1 h-[90%] flex flex-col justify-between">
// 			<Separator className="w-1 h-[7%] rotate-0" />
// 			<Separator className="w-1 h-[83%] rotate-0" />
// 		</div>
// 	);
// }

// export default function Chat() {
// 	const [socket, setSocket] = useState(null);
// 	const [activeConv, setActiveConv] = useState(null);

// 	useEffect(() => {
// 		if (!socket) {
// 			setSocket(new WebSocket(wsChat + `?token=${getToken()}`));
// 			console.log("connect with ws/chat");
// 			return;
// 		}
// 		socket.onmessage = (e) => {
// 			const data = JSON.parse(e.data);
// 			console.log(e);
// 			console.log(data);
// 		};

// 		return () => {
// 			socket.close();
// 			console.log("Disconnect with ws/chat");
// 		};
// 	}, [socket]);

// 	return (
// 		<WsChatContext.Provider value={socket}>
// 			<div className="h-screen w-full m-0 flex flex-row bg-[#202020]">
// 				<SideBar convState={[activeConv, setActiveConv]} lastMsgTime />
// 				<Separators />
// 				<ConversationSection
// 					convState={[activeConv, setActiveConv]}
// 					lastMsgTime
// 				/>
// 			</div>
// 		</WsChatContext.Provider>
// 	);
// }

export default function page() {
	return <div>Chat</div>;
}
