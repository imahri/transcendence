import React, { useRef } from "react";
import SendLogo from "/Chat_assets/send_icon.svg";
import styles from "./styles/TypingBar.module.css";

function send(message) {
	// console.log(message);
}

export default function TypingBar({ addMessage }) {
	const inputMessage = useRef();

	const handleClick = () => {
		if (inputMessage.current.value.length === 0) return;
		send(inputMessage.current.value);
		addMessage(inputMessage.current.value);
		inputMessage.current.value = "";
	};

	const handleEnterKey = (e) => {
		if (e.key === "Enter") handleClick();
	};
	return (
		<div className={styles.container}>
			<label className={styles.label}>
				<input
					onKeyDown={handleEnterKey}
					ref={inputMessage}
					className={styles.input}
					type="text"
					placeholder="Type a message..."
				/>
				<button className={styles.button} onClick={handleClick}>
					<img
						className={styles.img}
						src={SendLogo}
						alt="Send logo"
					/>
				</button>
			</label>
		</div>
	);
}
