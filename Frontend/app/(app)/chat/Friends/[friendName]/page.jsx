"use client";
import MessagesSection from "../../Components/Conversations/MessagesSection";
import ProfileBar from "../../Components/Conversations/ProfileBar";
import TypingBar from "../../Components/Conversations/TypingBar";
import { DummyMessages } from "../../DummyData";

export default function directMessage({ params }) {
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
