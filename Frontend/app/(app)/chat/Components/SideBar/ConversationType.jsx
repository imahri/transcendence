"use client";
import React, { useContext, useState } from "react";
import styles from "./styles/ConversationType.module.css";
import { useRouter, usePathname } from "next/navigation";
import { ConvTypeChatContext } from "../../context/context";
const conversation_types = ["Friends", "Groups"];

function List({ children, type, isActive }) {
	const router = useRouter();
	const [convType, setConvType] = useContext(ConvTypeChatContext);

	const handleActive = () => {
		if (!isActive) {
			setConvType(type);
		}
		router.push(`/chat/${type}`);
	};

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

export default function ConversationType() {
	const conv_type = usePathname().replace("/chat/", "");

	return (
		<div className={styles.container}>
			<nav className={styles.nav}>
				{conversation_types.map((type, idx) => (
					<List key={idx} type={type} isActive={conv_type === type}>
						{type}
					</List>
				))}
			</nav>
		</div>
	);
}
