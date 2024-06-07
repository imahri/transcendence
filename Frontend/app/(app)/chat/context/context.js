"use client";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { useNotification } from "../Hooks/useNotification";
import { useWebsocket } from "../../hooks/useWebsocket";
import { Loader } from "@/app/Components/Loader";

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
	const [socket, isReady] = useWebsocket(APIs.chat.ws);
	const { user } = useContext(UserContext);
	const { sendNotif, addListenerNotif } = useNotification();
	const [data, setData] = useState({ conversations: [] });
	const [Loading, setLoading] = useState(true);
	const RenderIt = Loading || !isReady;

	useEffect(() => {
		getConversations().then((_data) => {
			setData(_data);
			setLoading(false);
		});
	}, []);

	return (
		<>
			{RenderIt ? (
				<Loader />
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
