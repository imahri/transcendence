"use client";
import React, { useContext, useState } from "react";
import styles from "./styles/ConversationType.module.css";
import { useRouter, usePathname } from "next/navigation";
import { ConvTypeChatContext } from "../../context/context";

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
	const conv_type = usePathname();

	return (
		<div className={styles.container}>
			<nav className={styles.nav}>
				<List
					type="Friends"
					isActive={conv_type.includes("/chat/Friends")}
				>
					Friends
				</List>
				<List
					type="Groups"
					isActive={conv_type.includes("/chat/Groups")}
				>
					Groups
				</List>
			</nav>
		</div>
	);
}
