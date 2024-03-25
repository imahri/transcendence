import Image from "next/image";
import React, { useRef } from "react";
import SendLogo from "./assets/send_icon.svg";
import styles from "./styles/TypingBar.module.css";

export function TypingBar({ onSend }) {
	const inputMessage = useRef();

	const handleClick = () => {
		if (inputMessage.current.value.length === 0) return;
		onSend(inputMessage.current.value);
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
					<Image
						width={500}
						height={500}
						className={styles.img}
						src={SendLogo}
						alt="Send logo"
					/>
				</button>
			</label>
		</div>
	);
}
