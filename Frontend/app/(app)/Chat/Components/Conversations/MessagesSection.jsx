/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import styles from "./styles/MessagesSection.module.css";
import { messageTypes } from "./ConversationSection";

function Message({ messageInfo, friendName, isSent }) {
	const messageSection_style = isSent
		? "justify-end pr-9"
		: "justify-start pl-9";
	const message_style = isSent
		? "rounded-s-2xl rounded-br-2xl"
		: "rounded-e-2xl rounded-bl-2xl";
	const message_time_style = isSent ? "self-start" : "self-end";

	return (
		<div className={`${styles.messageSection} ${messageSection_style}`}>
			<section
				key={messageInfo.time}
				className={`${styles.message} ${message_style}`}
			>
				{!isSent && (
					<h3 className={styles.message_name}>{friendName}</h3>
				)}
				<p className={styles.message_text}>{messageInfo.message}</p>
				<small
					className={`${styles.message_time} ${message_time_style}`}
				>
					{messageInfo.time}
				</small>
			</section>
		</div>
	);
}

export default function MessagesSection({ friendName, messageList }) {
	const scrollRef = useRef();

	useEffect(() => {
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [messageList]);

	return (
		<div ref={scrollRef} className={styles.container}>
			{messageList &&
				messageList.map((messageInfo, idx) => {
					return (
						<Message
							key={idx}
							friendName={friendName}
							messageInfo={messageInfo}
							isSent={messageInfo.type === messageTypes.Sent}
						/>
					);
				})}
		</div>
	);
}
