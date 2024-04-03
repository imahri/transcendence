"use client";
import Image from "next/image";
import styles from "./styles/Conversations.module.css";
import { useContext, useState } from "react";
import { ConvChatContext, WsChatContext } from "../context/context";
import { useRouter } from "next/navigation";
import { useConvState } from "../Hooks/useConvState";
import { ToHour12Time } from "@/Tools/getCurrentTime";
import { USER_APP } from "@/app/URLS";

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

function ProfileImage({ src }) {
	return (
		<div className={styles.image}>
			<Image
				width={100}
				height={100}
				className={styles.img}
				src={src}
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

function TimeNotification({ time, unseen_msg }) {
	return (
		<div className="h-full w-[17%] rounded-r-sm flex justify-center items-center flex-col">
			<small className="mr-2 mt-2 font-light text-[#7D7D7D]">
				{ToHour12Time(time)}
			</small>
			<div className="flex-grow w-full flex justify-center items-center">
				{unseen_msg > 0 && <Unseen count={unseen_msg} />}
			</div>
		</div>
	);
}

function Conversation({ info: { name, image, last_message, unseen_msg } }) {
	const router = useRouter();
	const [convState, setConvState] = useContext(ConvChatContext);
	const profileImage = USER_APP + "/image?path=" + image; // !! For security: Change it to Image object

	const handleClick = () => {
		if (convState !== name) {
			// TODO : set unseen_message_count to 0 because you see message XD
			router.push(`/chat/${name}`);
			setConvState(name);
		}
	};

	return (
		<button
			onClick={handleClick}
			className={`${styles.section} ${convState == name ? styles.focus_section : ""}`}
		>
			<ProfileImage src={profileImage} />
			<FriendInfo friend_name={name} last_msg={last_message.message} />
			<TimeNotification
				time={last_message.sended_at}
				unseen_msg={unseen_msg}
			/>
		</button>
	);
}

export default function Conversations() {
	const [convState, setConvState] = useConvState();
	const { socket, data } = useContext(WsChatContext);
	const [convList, setConvList] = useState(data.conversations);
	const [convListOffset, setConvListOffset] = useState(data.size);

	return (
		<ConvChatContext.Provider value={[convState, setConvState]}>
			<div className={styles.container}>
				{convList.map((conversation, idx) => (
					<Conversation key={idx} info={conversation} />
				))}
			</div>
		</ConvChatContext.Provider>
	);
}
