import Image from "next/image";
import React from "react";
import styles from "./styles/ProfileBar.module.css";
import optionsIcon from "./assets/options_icon.svg";
import exitArrow from "./assets/exit_arrow.svg";

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

export function ProfileBar({ name, profileImg, activeStatus, onExit }) {
	const openProfileSection = () => alert("Profile Section not implemented");

	return (
		<div className={styles.container}>
			<button className={styles.exitArrow} onClick={onExit}>
				<Image
					className={styles.exitArrow_Image}
					width={100}
					height={100}
					src={exitArrow}
					alt="exit arrow"
				/>
			</button>
			<div className={styles.profileBar}>
				<button onClick={openProfileSection}>
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
			</div>
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
