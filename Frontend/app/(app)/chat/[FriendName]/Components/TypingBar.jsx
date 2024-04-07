import Image from "next/image";
import React, { useRef } from "react";
import SendLogo from "./assets/send_icon.svg";
import styles from "./styles/TypingBar.module.css";

export function TypingBar({ onSend }) {
	const inputMessage = useRef();

	const handleClick = () => {
		if (inputMessage.current.value.trim().length === 0) return;
		onSend(inputMessage.current.value);
		inputMessage.current.value = "";
	};

	return (
		<div className={styles.container}>
			<label>
				<input
					onKeyDown={(e) => e.key === "Enter" && handleClick()}
					ref={inputMessage}
					type="text"
					placeholder="Type a message..."
				/>
				<button onClick={handleClick}>
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
