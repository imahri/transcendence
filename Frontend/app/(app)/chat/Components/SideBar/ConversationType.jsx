"use client";
import React, { useContext, useState } from "react";
import styles from "./styles/ConversationType.module.css";
import { useRouter } from "next/navigation";
import { ConvChatContext } from "../../context/context";

function List({ type }) {
	const [convState, setConvState] = useContext(ConvChatContext);
	const router = useRouter();

	const handleActive = () => {
		if (type !== convState.type) {
			setConvState({
				type: type,
				current_conv: null,
			});
			router.push(`/chat/${type}`);
		}
	};

	return (
		<button
			className={`${styles.list_container} 
			${type === convState.type ? styles.list_container_onActive : ""}
			`}
			onClick={handleActive}
		>
			{type}
		</button>
	);
}

export default function ConversationType() {
	return (
		<div className={styles.container}>
			<nav className={styles.nav}>
				<List type="Friends" />
				<List type="Groups" />
			</nav>
		</div>
	);
}
