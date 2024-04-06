"use client";
import Image from "next/image";
import React from "react";
import styles from "./styles/ProfileBar.module.css";
import optionsIcon from "./assets/options_icon.svg";
import exitArrow from "./assets/exit_arrow.svg";
import { useRouter } from "next/navigation";

export const ActiveStatusTypes = Object.freeze({
	Active: "Active Now",
	Offline: "Offline",
});

function Status({ status }) {
	return (
		<div className="flex">
			<div className="flex justify-center items-center mr-2">
				<div
					className={`${styles.status} ${status === ActiveStatusTypes.Active ? "bg-green-400" : "bg-red-700"}`}
				></div>
			</div>
			<h3>{status}</h3>
		</div>
	);
}

export function ProfileBar({ name, profileImg, activeStatus }) {
	const route = useRouter();
	const openProfileSection = () => alert("Profile Section not implemented");

	return (
		<div className={styles.container}>
			<button
				className={styles.exitArrow}
				onClick={() => route.push("/chat")}
			>
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
						<Status status={activeStatus} />
					</section>
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
