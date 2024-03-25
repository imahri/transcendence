import { useEffect, useState } from "react";
import ProfileBar from "./ProfileBar";
import MessagesSection, { MessageTypes } from "./MessagesSection";
import TypingBar from "./TypingBar";
import { DummyMessages } from "../../DummyData";

export function Converstation({ friendName }) {
	const [messages, setMessages] = useState([]);

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
				type: "sent",
			},
		]);
	};

	return (
		<div className="w-full h-full">
			<ProfileBar friendName={friendName} />
			<MessagesSection friendName={friendName} messageList={messages} />
			<TypingBar onSend={onSend} />
		</div>
	);
}
