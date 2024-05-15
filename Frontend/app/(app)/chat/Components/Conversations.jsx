"use client";
import Image from "next/image";
import styles from "./styles/Conversations.module.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ConvChatContext, WsChatContext } from "../context/context";
import { useRouter, useSearchParams } from "next/navigation";
import { ToHour12Time } from "@/Tools/getCurrentTime";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { UserContext } from "../../context";
import { useOnVisibleAnimation } from "../Hooks/useOnVisibleAnimation";
import { Iceland } from "next/font/google";

const iceland = Iceland({ weight: "400", subsets: ["latin"] });

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
	const ConvRef = useRef();
	const [convState, setConvState] = useContext(ConvChatContext);
	const isActive = convState === name;
	// !! For security: Change it to Image object

	useEffect(() => {
		ConvRef.current.classList.toggle(styles.focus_section, isActive);
	}, [isActive]);

	const handleClick = () => {
		if (!isActive) {
			// TODO : set unseen_message_count to 0 because you see message XD
			router.push(`/chat/${name}`);
			setConvState(name);
		}
	};

	return (
		<button ref={ConvRef} onClick={handleClick} className={styles.section}>
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
	_convState: [convState, setConvState],
	_Conversations: {
		conversationList,
		setConversationList,
		LoadMoreConversation,
		LoadToReplace,
	},
}) {
	const {
		user,
		addListenerNotif,
		messageUpdatedState: [messageUpdated, setMessageUpdated],
	} = useContext(WsChatContext);
	const { ws } = useContext(UserContext);
	const [FirstInitial, setFirstInitial] = useState(true);
	const ConversationsRef = useRef();
	useOnVisibleAnimation(ConversationsRef, styles.show, [conversationList]);
	const router = useRouter();
	const searchParams = useSearchParams();
	const OnMessage = useCallback(
		(e) => {
			const data = JSON.parse(e.data);
			if (data.type == "friendShip") {
				if (data.status == "B" || data.status == "BY") {
					setConversationList(
						conversationList.filter(
							(conv) => conv.name !== data.friendName,
						),
					);
					if (data.status == "B") router.replace("/chat");
					LoadToReplace();
				}
			}
		},
		[conversationList],
	);

	useEffect(() => {
		const remove_conv = searchParams.get("remove_conv");
		if (remove_conv)
			setConversationList(
				conversationList.filter((conv) => conv.name !== remove_conv),
			);
	}, [searchParams]);

	if (ws) ws.addEventListener("message", OnMessage);

	useEffect(() => {
		if (
			FirstInitial &&
			conversationList.length != 0 &&
			ConversationsRef.current.clientHeight >=
				ConversationsRef.current.scrollHeight
		) {
			LoadMoreConversation();
			setFirstInitial(false);
		}
	}, [conversationList]);

	useEffect(() => {
		if (messageUpdated) {
			(async () => {
				let _convList = [...conversationList];
				let idx, id;
				_convList.forEach((conv, _idx) => {
					if (conv.name === convState) {
						idx = _idx;
						id = conv.id;
					}
				});
				const [isOk, status, data] = await fetch_jwt(
					`${APIs.chat.last_message}${id}`,
				);
				if (isOk) {
					_convList[idx].last_message = data;
					_convList.sort((f, s) =>
						f.last_message.sended_at > s.last_message.sended_at
							? -1
							: 1,
					);
					setConversationList(_convList);
					ConversationsRef.current.scrollTop = 0;
				}
			})();
			setMessageUpdated(false);
		}
	}, [conversationList, convState, messageUpdated]);

	useEffect(() => {
		const listener = () => console.log("yes");
		addListenerNotif(ws, listener);
	}, [ws]);

	const handleScroll = () => {
		if (
			ConversationsRef.current.clientHeight +
				ConversationsRef.current.scrollTop +
				1 >=
			ConversationsRef.current.scrollHeight
		)
			LoadMoreConversation();
	};

	return (
		<ConvChatContext.Provider value={[convState, setConvState]}>
			<div
				ref={ConversationsRef}
				onScroll={handleScroll}
				className={styles.container}
			>
				{conversationList ? (
					conversationList.map((conversation, idx) => (
						<Conversation
							key={idx}
							user={user}
							info={conversation}
						/>
					))
				) : (
					<h1
						className={`text-[#C1C1C1] text-3xl ${iceland.className}`}
					>
						No Conversations
					</h1>
				)}
			</div>
		</ConvChatContext.Provider>
	);
}
