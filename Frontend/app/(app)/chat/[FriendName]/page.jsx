"use client";
import { useContext, useEffect, useState } from "react";
import { MessagesSection, MessageTypes } from "./Components/MessagesSection";
import { ActiveStatusTypes, ProfileBar } from "./Components/ProfileBar";
import { TypingBar } from "./Components/TypingBar";
import { DummyMessages, DummyPath } from "../DummyData";
import { getCurrentTime } from "@/Tools/getCurrentTime";
import { WsChatContext } from "../context/context";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";

async function getMessages(conversation_id) {
	const data = await fetch_jwt(APIs.chat.messages, {
		conversation: conversation_id,
		limit: 10,
		offset: 0,
	});
	data.messages.sort((a, b) =>
		a.sended_at > b.sended_at ? 1 : a.sended_at < b.sended_at ? -1 : 0,
	);
	return data;
}

function get_conversation_id(data, FriendName) {
	let id;
	data.conversations.forEach((conversation) => {
		if (conversation.name == FriendName) id = conversation.id;
	});
	return id;
}

export default function DM_Conversation({ params: { FriendName } }) {
	const { user, socket, data } = useContext(WsChatContext);
	const [conversation_id] = useState(get_conversation_id(data, FriendName));
	const [messages, setMessages] = useState([]);
	const [messagesOffset, setMessagesOffset] = useState(0);

	useEffect(() => {
		const _getMessages = async () => {
			const new_messages = await getMessages(conversation_id);
			setMessages(new_messages.messages);
			setMessagesOffset(new_messages.size);
		};

		_getMessages();
	}, [FriendName]);

	useEffect(() => {
		if (socket) socket.onmessage = (e) => onReceive(messages, e.data);
	}, [messages, FriendName]);

	const onSend = (new_msg) => {
		const message = {
			conversation_id: conversation_id,
			status: MessageTypes.Sent,
			send_to: FriendName,
			message: new_msg,
			sended_at: getCurrentTime(),
		};
		socket.send(JSON.stringify(message));
		console.log(message);
		setMessages([...messages, message]);
	};

	const onReceive = (messages, new_msg) => {
		const message = JSON.parse(new_msg);
		if (FriendName == message.sender) setMessages([...messages, message]);
		console.log(message);
	};

	return (
		<div className="w-full h-full">
			<ProfileBar
				name={FriendName}
				profileImg={user.info.profile_img}
				activeStatus={ActiveStatusTypes.Active}
			/>
			<MessagesSection FriendName={FriendName} messageList={messages} />
			<TypingBar onSend={onSend} />
		</div>
	);
}
