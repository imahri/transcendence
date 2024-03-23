import { useEffect, useState } from "react";
import ProfileBar from "./ProfileBar";
import MessagesSection from "./MessagesSection";
import TypingBar from "./TypingBar";

export const messageTypes = Object.freeze({
	Sent: "sent",
	Received: "received",
});

let DummyMessages = [
	{
		message: "Just finished that report, feels good!",
		time: "09:17 AM",
		type: "sent",
	},
	{
		message: "Hey everyone, meeting reminder at 2PM!",
		time: "11:34 AM",
		type: "sent",
	},
	{
		message: "Can someone help me debug this code?",
		time: "01:08 PM",
		type: "received",
	},
	{
		message: "Lunch break! ",
		time: "12:30 PM",
		type: "sent",
	},
	{
		message: "Got those coffee beans refilled. ☕️",
		time: "03:52 PM",
		type: "sent",
	},
	{
		message: "Almost finished with this task, just a few more minutes.",
		time: "04:15 PM",
		type: "sent",
	},
	{
		message: "Does anyone know if the office is open tomorrow?",
		time: "05:23 PM",
		type: "sent",
	},
	{
		message: "Have a great evening everyone!",
		time: "06:00 PM",
		type: "sent",
	},
	{
		message: "Just checking in, is everything on track?",
		time: "10:24 AM",
		type: "received",
	},
	{
		message: "  Happy Birthday Sarah!  ",
		time: "02:47 PM",
		type: "sent",
	},
];

export function Converstation({ friendName }) {
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		// Load Messages from db
		// Ex
		setMessages(...messages, DummyMessages);
	}, []);

	const addMessage = (new_msg) => {
		let date = new Date();

		setMessages([
			...messages,
			{
				message: new_msg,
				time: date.toLocaleTimeString([], {
					hour: "numeric",
					minute: "numeric",
					hour12: true,
				}),
				type: "sent",
			},
		]);
	};

	return (
		<div className="w-full h-full">
			<ProfileBar friendName={friendName} />
			<MessagesSection friendName={friendName} messageList={messages} />
			<TypingBar addMessage={addMessage} />
		</div>
	);
}

// export default function ConversationSection() {
// 	// const [activeConv, setActiveConv] = useContext(ConvChatContext);
// 	return (
// 		<main className={styles.main}>
// 			{activeConv === null ? (
// 				<NoConv />
// 			) : (
// 				<Converstation friendName={'Emily'} />
// 			)}
// 		</main>
// 	);
// }
