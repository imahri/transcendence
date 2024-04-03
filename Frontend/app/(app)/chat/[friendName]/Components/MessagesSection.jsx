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

function Message({ messageInfo, send_by, isSent }) {
	const [messageSection_style, message_style, message_time_style] =
		genStyles(isSent);

	return (
		<div className={`${styles.messageSection} ${messageSection_style}`}>
			<section className={`${styles.message} ${message_style}`}>
				{!isSent && <h3 className={styles.message_name}>{send_by}</h3>}
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

export function MessagesSection({ send_by, messageList }) {
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
							send_by={send_by}
							messageInfo={messageInfo}
							isSent={messageInfo.type === MessageTypes.Sent}
						/>
					);
				})}
		</div>
	);
}
