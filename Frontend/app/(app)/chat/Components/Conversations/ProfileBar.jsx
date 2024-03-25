import Image from "next/image";
import React from "react";
import styles from "./styles/ProfileBar.module.css";
import optionsIcon from "./assets/options_icon.svg";

export const ActiveStatusTypes = Object.freeze({
	Active: "Active Now",
	Offline: "Offline",
});

function Status({ status }) {
	return (
		<div
			className={`${styles.status} ${status === ActiveStatusTypes.Active ? "bg-green-400" : "bg-red-700"}`}
		></div>
	);
}

export default function ProfileBar({ name, profileImg, activeStatus }) {
	const openProfileSection =
		profileOpenFunc !== undefined
			? profileOpenFunc
			: () => alert("Profile Section not implemented");

	return (
		<div className={styles.container}>
			<button onClick={openProfileSection} className={styles.profileBar}>
				<Image
					className={styles.profileBar_Image}
					width={100}
					height={100}
					src={profileImg}
					alt="Profile image"
				/>
				<section className={styles.profileInfo}>
					<h2>{name}</h2>
					<h3>{activeStatus}</h3>
				</section>
				<Status status={activeStatus} />
			</button>
			<div className={styles.options}>
				<button>
					<Image
						className={styles.options_Image}
						width={100}
						height={100}
						src={optionsIcon}
						alt="options icon"
					/>
				</button>
			</div>
		</div>
	);
}
