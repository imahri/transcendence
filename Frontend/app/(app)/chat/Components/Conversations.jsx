"use client";
import Image from "next/image";
import styles from "./styles/Conversations.module.css";
import { useContext, useEffect, useState } from "react";
import { ConvChatContext, WsChatContext } from "../context/context";
import { useRouter } from "next/navigation";
import { useConvState } from "../Hooks/useConvState";
import { ToHour12Time } from "@/Tools/getCurrentTime";
import { USER_APP } from "@/app/URLS";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";

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
			{last_msg && (
				<small className="mt-2 text-start font-medium text-[#7D7D7D]">
					{last_msg.length > 20
						? `${last_msg.substring(0, 20)}...`
						: last_msg}
				</small>
			)}
		</div>
	);
}

function TimeNotification({ time, unseen_msg }) {
	return (
		<div className="h-full w-[18%] rounded-r-sm flex justify-center items-center flex-col">
			<small className="mr-2 mt-2 font-light text-xs text-[#7D7D7D]">
				{ToHour12Time(time)}
			</small>
			<div className="flex-grow w-full flex justify-center items-center">
				{unseen_msg > 0 && <Unseen count={unseen_msg} />}
			</div>
		</div>
	);
}

function Conversation({
	user,
	info: { name, image, last_message, unseen_msg },
}) {
	const router = useRouter();
	const [convState, setConvState] = useContext(ConvChatContext);
	const isActive = convState === name;
	// !! For security: Change it to Image object

	const handleClick = () => {
		if (!isActive) {
			// TODO : set unseen_message_count to 0 because you see message XD
			router.push(`/chat/${name}`);
			setConvState(name);
		}
	};

	return (
		<button
			onClick={handleClick}
			className={`${styles.section} ${isActive && styles.focus_section}`}
		>
			<ProfileImage src={user.info.profile_img} />
			<FriendInfo
				friend_name={name}
				last_msg={!isActive && last_message?.message}
			/>
			{last_message && (
				<TimeNotification
					time={last_message.sended_at}
					unseen_msg={unseen_msg}
				/>
			)}
		</button>
	);
}

export default function Conversations({
	_convState,
	_convList,
	_convListOffset,
}) {
	const {
		user,
		socket,
		data,
		messageUpdatedState: [messageUpdated, setMessageUpdated],
	} = useContext(WsChatContext);
	const [convState, setConvState] = _convState;
	const [prevConv, setPrevConv] = useState(null);
	const [convList, setConvList] = _convList;
	const [convListOffset, setConvListOffset] = _convListOffset;

	const _setConvState = (newState) => {
		setPrevConv(convState);
		setConvState(newState);
	};

	useEffect(() => {
		if (messageUpdated) {
			const update = async () => {
				let _convList = [...convList];
				let idx;
				let id;
i
				const [isOk, status, data] = await fetch_jwt(
					`${APIs.chat.last_message}${id}`,
				);
				if (isOk) {
					_convList[idx].last_message = data;
					_convList.sort((f, s) => {
						console.log(
							f.last_message.sended_at,
							s.last_message.sended_at,
						);
						if (
							f.last_message.sended_at > s.last_message.sended_at
						) {
							return -1;
						}
						if (f.last_message.sended_at < s.last_message.sended_at)
							return 1;
					});
					console.log(_convList);
					setConvList(_convList);
				}
			};
			update();
			setMessageUpdated(false);
		}
	}, [prevConv, messageUpdated]);

	return (
		<ConvChatContext.Provider value={[convState, _setConvState]}>
			<div className={styles.container}>
				{convList.map((conversation, idx) => (
					<Conversation key={idx} user={user} info={conversation} />
				))}
			</div>
		</ConvChatContext.Provider>
	);
}
