"use client";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { useNotification } from "../Hooks/useNotification";

export const WsChatContext = createContext();

async function getConversations() {
	const [isOk, status, data] = await fetch_jwt(APIs.chat.conversations, {
		offset: 1,
	});
	if (isOk) {
		const seen = new Set();
		const newList = [];
		for (const obj of data.conversations) {
			const id = obj.id;
			if (!seen.has(id)) {
				seen.add(id);
				newList.push(obj);
			}
		}
		data.conversations = newList;
		return data;
	}
	return { conversations: [] };
}

export const WsChatProvider = ({ children }) => {
	const messageUpdatedState = useState(false);
	const [socket, setSocket] = useState(null);
	const { user } = useContext(UserContext);
	const { sendNotif, addListenerNotif } = useNotification();
	const [data, setData] = useState({ conversations: [] });
	const [Loading, setLoading] = useState(true);

	useEffect(() => {
		getConversations().then((_data) => {
			setData(_data);
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!socket) {
			setSocket(new WebSocket(APIs.chat.ws + `?token=${getToken()}`));
			return;
		}
		socket.onopen = () => console.log("Connected with ws/chat");
		socket.onerror = () => console.log("Error in ws/chat");
		socket.onclose = () => console.log("Disconnected with ws/chat");
		return () => socket.close();
	}, [socket]);

	return (
		<>
			{Loading ? (
				<div className="w-screen h-screen bg-[#202020] flex justify-center items-center text-white">
					is Loading ....
				</div>
			) : (
				<WsChatContext.Provider
					value={{
						user: user,
						socket: socket,
						data: data,
						messageUpdatedState: messageUpdatedState,
						sendNotif: sendNotif,
						addListenerNotif: addListenerNotif,
					}}
				>
					{children}
				</WsChatContext.Provider>
			)}
		</>
	);
};

export const ConvChatContext = createContext();
