"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { MessagesSection, MessageTypes } from "./Components/MessagesSection";
import { ActiveStatusTypes, ProfileBar } from "./Components/ProfileBar";
import { TypingBar } from "./Components/TypingBar";
import { getCurrentTime } from "@/Tools/getCurrentTime";
import { WsChatContext } from "../context/context";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { ProfileSection } from "./Components/ProfileSection/ProfileSection";
import useConversationID from "../Hooks/useConversationID";
import { GET_USER_URL } from "@/app/URLS";

async function getMessages(conversation_id) {
	if (conversation_id != 0) {
		const [isOk, status, data] = await fetch_jwt(APIs.chat.messages, {
			conversation: conversation_id,
			limit: 10,
			offset: 0,
		});
		if (!isOk) {
			console.log("==> ", status);
			return { messages: [], size: 0 };
		}
		data.messages.sort((a, b) =>
			a.sended_at > b.sended_at ? 1 : a.sended_at < b.sended_at ? -1 : 0,
		);
		return data;
	}
	return { messages: [], size: 0 };
}

async function getFriendInfo(FriendName) {
	const [isOk, status, data] = await fetch_jwt(GET_USER_URL, {
		username: FriendName,
	});
	if (isOk) {
		let info = {
			id: data.user.id,
			name: FriendName,
			image: data.user.img,
			level: data.user.info.level,
		};
		return info;
	}
	return null;
}

export default function DM_Conversation({ params: { FriendName } }) {
	const {
		user,
		socket,
		data,
		messageUpdatedState: [messageUpdated, setmessageUpdated],
	} = useContext(WsChatContext);
	const [conversation_id] = useConversationID(FriendName);
	const [friendinfo, setFriendinfo] = useState({
		name: FriendName,
		image: null,
		status: true,
	});
	const [messages, setMessages] = useState([]);
	const [messagesOffset, setMessagesOffset] = useState(0);
	const [showProfile, setShowProfile] = useState(false);
	const _ref = useRef();

	useEffect(() => {
		getFriendInfo(FriendName).then((info) => setFriendinfo(info));

		getMessages(conversation_id).then((new_messages) => {
			setMessages(new_messages.messages);
			setMessagesOffset(new_messages.size);
		});
	}, [conversation_id, FriendName]);

	useEffect(() => {
		if (socket) socket.onmessage = (e) => onReceive(messages, e.data);
	}, [messages, FriendName]);

	const onSend = (new_msg) => {
		const message = {
			conversation_id: conversation_id,
			status: MessageTypes.Sent,
			send_to: FriendName,
			message: new_msg,
			sended_at: getCurrentTime(),
		};
		socket.send(JSON.stringify(message));
		console.log(message);
		setMessages([...messages, message]);
		setmessageUpdated(true);
	};

	const onReceive = (messages, new_msg) => {
		const message = JSON.parse(new_msg);
		if (FriendName == message.sender) {
			setMessages([...messages, message]);
			setmessageUpdated(true);
		}
		console.log(message);
	};

	return (
		<>
			<div className="flex-grow h-screen">
				<ProfileBar
					friendinfo={friendinfo}
					activeStatus={ActiveStatusTypes.Active}
					onOpenProfile={() => {
						showProfile
							? _ref.current.classList.remove("scale-100")
							: _ref.current.classList.add("scale-100");
						setShowProfile(!showProfile);
					}}
				/>
				<MessagesSection
					FriendName={FriendName}
					messageList={messages}
				/>
				<TypingBar onSend={onSend} />
			</div>
			<ProfileSection
				_ref={_ref}
				className="transition-all duration-300 scale-0 origin-right"
				status={ActiveStatusTypes.Active}
				friendinfo={friendinfo}
			/>
		</>
	);
}
