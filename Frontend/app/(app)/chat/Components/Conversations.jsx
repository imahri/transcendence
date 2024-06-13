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

const Unseen = ({ count }) => (
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

const ProfileImage = ({ src }) => (
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

const FriendInfo = ({ friend_name, last_msg }) => (
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

const TimeNotification = ({ time, unseen_msg }) => (
	<div className="h-full w-[18%] rounded-r-sm flex justify-center items-center flex-col">
		<small className="mr-2 mt-2 font-light text-xs text-[#7D7D7D]">
			{ToHour12Time(time)}
		</small>
		<div className="flex-grow w-full flex justify-center items-center">
			{unseen_msg > 0 && <Unseen count={unseen_msg} />}
		</div>
	</div>
);

function Conversation({ info }) {
	const { ws } = useContext(UserContext);
	const { name, image, last_message, unseen_msg } = info;
	const router = useRouter();
	const ConvRef = useRef();
	const [convState, setConvState] = useContext(ConvChatContext);
	const isActive = convState === name;

	useEffect(() => {
		if (ws) {
			info.unseen_msg = 0;
			ws.send(
				JSON.stringify({
					action: "markConversationAsRead",
					id: info.id,
				}),
			);
		}
	}, [ws]);

	useEffect(() => {
		ConvRef.current.classList.toggle(styles.focus_section, isActive);
	}, [isActive]);

	const handleClick = () => {
		if (!isActive) {
			info.unseen_msg = 0;
			ws.send(
				JSON.stringify({
					action: "markConversationAsRead",
					id: info.id,
				}),
			);
			router.push(`/chat/${name}`);
			setConvState(name);
		}
	};
	return (
		<button ref={ConvRef} onClick={handleClick} className={styles.section}>
			<ProfileImage src={APIs.image(info.image)} />
			<FriendInfo
				friend_name={name}
				last_msg={!isActive && last_message?.message}
			/>
			{last_message && (
				<TimeNotification
					time={last_message.sended_at}
					unseen_msg={isActive ? 0 : unseen_msg}
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
		addListenerNotif,
		messageUpdatedState: [messageUpdated, setMessageUpdated],
	} = useContext(WsChatContext);
	const { ws } = useContext(UserContext);
	const [FirstInitial, setFirstInitial] = useState(true);
	const ConversationsRef = useRef();
	useOnVisibleAnimation(ConversationsRef, styles.show, [conversationList]);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const remove_conv = searchParams.get("remove_conv");
		if (remove_conv)
			setConversationList(
				conversationList.filter((conv) => conv.name !== remove_conv),
			);
	}, [searchParams]);

	const OnMessage = (e) => {
		const data = JSON.parse(e.data);
		if (
			data.type == "friendShip" &&
			(data.status == "B" || data.status == "BY")
		) {
			setConversationList((prevConversationList) =>
				prevConversationList.filter(
					(conv) => conv.name !== data.friendName,
				),
			);
			if (window.location.pathname.split("/").at(-1) == data.friendName)
				router.replace("/chat");
			LoadToReplace();
		}
	};

	useEffect(() => {
		if (!ws) return;
		ws.addEventListener("message", OnMessage);
		return () => ws.removeEventListener("message", OnMessage);
	}, [ws]);

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
					_convList?.sort((f, s) =>
						f.last_message?.sended_at > s.last_message?.sended_at
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

	const listener = useCallback(
		(e) => {
			if (e.content.FirstTime) {
				setConversationList((prevConvList) => [
					e.content.conversation,
					...prevConvList,
				]);
			} else {
				const convList = [...conversationList];
				let found = false;
				convList.forEach((conv) => {
					if (conv.id == e.content.conversationID) {
						found = true;
						if (convState !== conv.name) conv.unseen_msg += 1;
						conv.last_message = {
							sended_at: e.time,
							message: e.content.message,
						};
					}
				});
				found
					? setConversationList(convList)
					: setConversationList([
							e.content.conversation,
							...convList,
						]);
			}
		},
		[conversationList, convState],
	);

	useEffect(() => {
		addListenerNotif(ws, listener);
	}, [ws, listener]);

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
				{conversationList.length != 0 ? (
					conversationList.map((conversation, idx) => (
						<Conversation key={idx} info={conversation} />
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
