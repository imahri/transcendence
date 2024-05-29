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
import { useRouter } from "next/navigation";
import { useMessageList } from "../Hooks/useMessages";
import { UserContext } from "../../context";

async function getFriendInfo(FriendName) {
	// TODO: use route handler
	const [isOk, status, data] = await fetch_jwt(GET_USER_URL, {
		username: FriendName,
	});
	if (isOk) {
		let info = {
			id: data.user.id,
			name: FriendName,
			image: data.user.img,
			level: data.user.info.level,
			grade: data.user.info.grade.id,
		};
		return info;
	}
	return null;
}

function updateOnlineStatus(setActiveStatus, e, userName) {
	const data = JSON.parse(e.data);
	if (data.type == "onlineStatus") {
		if (userName == data.username)
			data.status == "online"
				? setActiveStatus(ActiveStatusTypes.Active)
				: setActiveStatus(ActiveStatusTypes.Offline);
	}
}

export default function DM_Conversation({ params: { FriendName } }) {
	const {
		socket,
		sendNotif,
		messageUpdatedState: [messageUpdated, setmessageUpdated],
	} = useContext(WsChatContext);
	const conversation_id = useConversationID(FriendName);
	const { messageList, addNewMessage, isUpdatedState, LoadMoreMessages } =
		useMessageList(conversation_id, setmessageUpdated);
	const [ActiveStatus, setActiveStatus] = useState(ActiveStatusTypes.Offline);
	const { ws } = useContext(UserContext);
	const [friendinfo, setFriendinfo] = useState({
		name: FriendName,
		image: null,
		status: true,
	});
	const [showProfile, setShowProfile] = useState(false);
	const _ref = useRef();
	const router = useRouter();

	if (socket) {
		socket.onmessage = (e) => {
			const message = JSON.parse(e.data);
			if (FriendName == message.sender) addNewMessage(message);
		};
	}

	const onSend = (new_msg) => {
		const message = {
			conversation_id: conversation_id,
			status: MessageTypes.Sent,
			send_to: FriendName,
			message: new_msg,
			sended_at: getCurrentTime(),
		};
		socket.send(JSON.stringify(message));
		sendNotif(
			FriendName,
			conversation_id,
			new_msg,
			messageList.length == 0,
		);
		console.log(message);
		addNewMessage(message);
	};

	useEffect(() => {
		getFriendInfo(FriendName).then((info) =>
			info ? setFriendinfo(info) : router.replace("/not-found"),
		);
	}, [FriendName]);

	useEffect(() => {
		if (!ws) return;

		ws.send(
			JSON.stringify({
				action: "checkStatus",
				username: FriendName,
			}),
		);
		const handelMessage = (e) =>
			updateOnlineStatus(setActiveStatus, e, FriendName);
		ws.addEventListener("message", handelMessage);

		return () => {
			ws.removeEventListener("message", handelMessage);
			ws.send(
				JSON.stringify({
					action: "end_checkStatus",
					username: FriendName,
				}),
			);
		};
	}, [ws]);

	return (
		<>
			<div className="flex-grow h-screen [@media(max-width:900px)]:h-[calc(100vh-65px)] flex flex-col justify-between items-center">
				<ProfileBar
					friendinfo={friendinfo}
					activeStatus={ActiveStatus}
					onOpenProfile={() => {
						showProfile
							? _ref.current.classList.remove("scale-100")
							: _ref.current.classList.add("scale-100");
						setShowProfile(!showProfile);
					}}
				/>
				<MessagesSection
					FriendName={FriendName}
					messageState={[
						messageList,
						isUpdatedState,
						LoadMoreMessages,
					]}
				/>
				<TypingBar onSend={onSend} />
			</div>
			<ProfileSection
				_ref={_ref}
				className="transition-all duration-300 scale-0 origin-right"
				status={ActiveStatus}
				friendinfo={friendinfo}
			/>
		</>
	);
}
