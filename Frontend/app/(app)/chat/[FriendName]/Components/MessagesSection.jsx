/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import styles from "./styles/MessagesSection.module.css";
import { ToHour12Time } from "@/Tools/getCurrentTime";

export const MessageTypes = Object.freeze({
	Sent: "sent",
	Received: "received",
});

function genStyles(bool) {
	return [
		bool ? "justify-end pr-9" : "justify-start pl-9",
		bool ? "rounded-s-2xl rounded-br-2xl" : "rounded-e-2xl rounded-bl-2xl",
		bool ? "self-start" : "self-end",
	];
}

function Message({ messageInfo, FriendName, isSent }) {
	const [messageSection_style, message_style, message_time_style] =
		genStyles(isSent);

	return (
		<div className={`${styles.messageSection} ${messageSection_style}`}>
			<section className={`${styles.message} ${message_style}`}>
				<p className={styles.message_text}>{messageInfo.message}</p>
				<small
					className={`${styles.message_time} ${message_time_style}`}
				>
					{ToHour12Time(messageInfo.sended_at)}
				</small>
			</section>
		</div>
	);
}

export function MessagesSection({
	FriendName,
	messageState: [messageList, isUpdatedState, LoadMoreMessages],
}) {
	const secRef = useRef();
	const messages = [...messageList].reverse();
	const [isUpdated, setIsUpdated] = isUpdatedState;

	useEffect(() => {
		if (isUpdated) {
			secRef.current.scrollTop = secRef.current.scrollHeight;
			setIsUpdated(false);
		}
	}, [isUpdated]);

	const onScroll = () => secRef.current.scrollTop == 0 && LoadMoreMessages();

	return (
		<div ref={secRef} onScroll={onScroll} className={styles.container}>
			{messages &&
				messages.map((messageInfo, idx) => (
					<Message
						key={idx}
						FriendName={FriendName}
						messageInfo={messageInfo}
						isSent={messageInfo.status === MessageTypes.Sent}
					/>
				))}
		</div>
	);
}
