import React, { useRef } from "react";
import SendIcon from "./assets/send_icon";
import styles from "./styles/TypingBar.module.css";

export function TypingBar({ onSend }) {
	const inputMessage = useRef();
	const labelRef = useRef();

	const handleClick = () => {
		if (inputMessage.current.value.trim().length === 0) return;
		onSend(inputMessage.current.value);
		inputMessage.current.value = "";
		labelRef.current.classList.remove(styles.reachTheLimit);
	};

	const handleChange = () =>
		labelRef.current.classList.toggle(
			styles.reachTheLimit,
			inputMessage.current.value.length >= 300,
		);

	return (
		<div className={styles.container}>
			<label ref={labelRef}>
				<input
					onChange={handleChange}
					maxLength={300}
					onKeyDown={(e) => e.key === "Enter" && handleClick()}
					ref={inputMessage}
					type="text"
					placeholder="Type a message..."
				/>
				<button onClick={handleClick}>
					<SendIcon className={styles.img} />
				</button>
			</label>
		</div>
	);
}
