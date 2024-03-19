/* eslint-disable react/prop-types */
import styles from "./styles/Conversations.module.css";
import { useState } from "react";

const DummyData = [
	{
		friend_name: "Alice",
		last_message: "Hey there!",
		unseen_message_count: 3,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Friends",
	},
	{
		friend_name: "Bob",
		last_message: "What's up?",
		unseen_message_count: 1,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Friends",
	},
	{
		friend_name: "Charlie",
		last_message: "How's it going?",
		unseen_message_count: 5,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Groups",
	},
	{
		friend_name: "David",
		last_message: "Long time no see!",
		unseen_message_count: 0,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Groups",
	},
	{
		friend_name: "Emily",
		last_message: "Up for a chat?",
		unseen_message_count: 7,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Friends",
	},
	{
		friend_name: "Finn",
		last_message: "Just checking in",
		unseen_message_count: 2,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Groups",
	},
	{
		friend_name: "Grace",
		last_message: "Miss you!",
		unseen_message_count: 4,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Friends",
	},
	{
		friend_name: "Henry",
		last_message: "Hope you're doing well!",
		unseen_message_count: 8,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Friends",
	},
	{
		friend_name: "Isla",
		last_message: "Let's catch up soon!",
		unseen_message_count: 6,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Friends",
	},
	{
		friend_name: "Jack",
		last_message: "Thinking of you!",
		unseen_message_count: 9,
		last_msg_time: "23:45 PM",
		type_of_conversation: "Groups",
	},
];

const DummyPath =
	"https://24ai.tech/en/wp-content/uploads/sites/3/2023/08/24ai_try_chair-1-150x150.webp";
// const DummyPath = "/home/reben-ha/Documents/transcendence/Frontend/public/logo.svg";

function Unseen({ count }) {
	return (
		<div
			className="
            h-6 w-6
			mb-3 pb-0.5
            bg-gradient-to-r from-[#7D46F2] to-[#CB3737]
            flex justify-center items-center
            rounded-full
            "
		>
			<small className="cursor-default text-white">{count}</small>
		</div>
	);
}

function ProfileImage() {
	return (
		<div className={styles.image}>
			<img className={styles.img} src={DummyPath} alt="Profile" />
		</div>
	);
}

function FriendInfo({ friend_name, last_msg }) {
	return (
		<div className="h-full flex-grow flex flex-col justify-start">
			<h3 className="pt-4 text-start text-xl font-semibold text-white">
				{friend_name}
			</h3>
			<small className="mt-2 text-start font-medium text-[#7D7D7D]">
				{last_msg.length > 20
					? `${last_msg.substring(0, 20)}...`
					: last_msg}
			</small>
		</div>
	);
}

function TimeNotification({ last_msg_time, unseen_message_count }) {
	return (
		<div className="h-full w-[17%] rounded-r-sm flex justify-center items-center flex-col">
			<small className="mr-2 mt-2 font-light text-[#7D7D7D]">
				{last_msg_time}
			</small>
			<div className="flex-grow w-full flex justify-center items-center">
				{unseen_message_count > 0 ? (
					<Unseen count={unseen_message_count} />
				) : (
					""
				)}
			</div>
		</div>
	);
}

function Conversation({ data, setter, isActive }) {
	const last_msg = "OOOOOOOOOOOOOOOOOOOO000000000000000";

	const handleClick = () => {
		/* get data */
		setter(data.friend_name);
		data.unseen_message_count = 0; // set unseen_message_count to 0 because you see message XD
	};

	return (
		<button
			onClick={handleClick}
			className={`${styles.section} ${isActive ? styles.focus_section : ""}`}
		>
			<ProfileImage />
			<FriendInfo friend_name={data.friend_name} last_msg={last_msg} />
			<TimeNotification
				last_msg_time={data.last_msg_time}
				unseen_message_count={data.unseen_message_count}
			/>
		</button>
	);
}

export default function Conversations({ type, convState }) {
	const [activeConv, setActiveConv] = convState;
	return (
		<div className={styles.container}>
			{DummyData.map(
				(conversation) =>
					type === conversation.type_of_conversation && (
						<Conversation
							key={conversation.friend_name}
							data={conversation}
							setter={setActiveConv}
							isActive={activeConv === conversation.friend_name}
						/>
					),
			)}
		</div>
	);
}
