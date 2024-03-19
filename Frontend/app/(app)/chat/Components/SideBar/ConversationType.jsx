import React, { useState } from "react";
import styles from "./styles/ConversationType.module.css";

const conversation_types = ["Friends", "Groups"];

function List({ children, Key, isActive, setActive }) {
	function handleActive() {
		if (!isActive) {
			setActive(Key);
		}
	}

	return (
		<button
			className={`${styles.list_container} 
			${isActive ? styles.list_container_onActive : ""}
			`}
			onClick={handleActive}
		>
			{children}
		</button>
	);
}

export default function ConversationType({ active_type, setActiveType }) {
	return (
		<div className={styles.container}>
			<nav className={styles.nav}>
				{conversation_types.map((type) => (
					<List
						Key={type}
						isActive={active_type === type}
						setActive={setActiveType}
					>
						{type}
					</List>
				))}
			</nav>
		</div>
	);
}
