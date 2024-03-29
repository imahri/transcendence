"use client";
import { useEffect, useState } from "react";
import {
	MessagesSection,
	MessageTypes,
} from "../Components/Conversations/MessagesSection";
import {
	ActiveStatusTypes,
	ProfileBar,
} from "../Components/Conversations/ProfileBar";
import { TypingBar } from "../Components/Conversations/TypingBar";
import { DummyMessages, DummyPath } from "../DummyData";
import { getCurrentTime } from "../Tools/getCurrentTime";

export default function DM_Conversation({ params }) {
	const [messages, setMessages] = useState([]);
	const FriendName = params.friendName;

	useEffect(() => {
		// Load Messages from db
		// Ex
		setMessages(...messages, DummyMessages);
	}, []);

	const onSend = (new_msg) => {
		setMessages([
			...messages,
			{
				message: new_msg,
				time: getCurrentTime(),
				type: MessageTypes.Sent,
			},
		]);
	};

	return (
		<div className="w-full h-full">
			<ProfileBar
				name={FriendName}
				profileImg={DummyPath}
				activeStatus={ActiveStatusTypes.Active}
			/>
			<MessagesSection send_by={FriendName} messageList={messages} />
			<TypingBar onSend={onSend} />
		</div>
	);
}
