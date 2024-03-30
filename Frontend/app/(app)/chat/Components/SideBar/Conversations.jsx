/* eslint-disable react/prop-types */
import Image from "next/image";
import styles from "./styles/Conversations.module.css";
import { useContext } from "react";
import { ConvChatContext } from "../../context/context";
import { useRouter } from "next/navigation";
import { DummyConversation, DummyPath } from "../../DummyData";

function Unseen({ count }) {
	return (
		<div
			className="
            h-6 w-6
			mb-3 pb-0.3
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
			<Image
				width={100}
				height={100}
				className={styles.img}
				src={DummyPath}
				alt="Profile"
			/>
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

function Conversation({ info }) {
	// Here update Conversation ??
	const router = useRouter();
	const [convState, setConvState] = useContext(ConvChatContext);
	const last_msg = "OOOOOOOOOOOOOOOOOOOO000000000000000";

	const handleClick = () => {
		/* get data */
		if (convState !== info.friend_name) {
			info.unseen_message_count = 0; // set unseen_message_count to 0 because you see message XD
			router.push(`/chat/${info.friend_name}`);
			setConvState(info.friend_name);
		}
	};

	return (
		<button
			onClick={handleClick}
			className={`${styles.section} ${convState == info.friend_name ? styles.focus_section : ""}`}
		>
			<ProfileImage />
			<FriendInfo friend_name={info.friend_name} last_msg={last_msg} />
			<TimeNotification
				last_msg_time={info.last_msg_time}
				unseen_message_count={info.unseen_message_count}
			/>
		</button>
	);
}

export default function Conversations() {
	return (
		<div className={styles.container}>
			{DummyConversation.map((conversation, idx) => (
				<Conversation key={idx} info={conversation} />
			))}
		</div>
	);
}
