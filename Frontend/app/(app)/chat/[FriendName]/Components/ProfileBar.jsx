"use client";
import Image from "next/image";
import React from "react";
import styles from "./styles/ProfileBar.module.css";
// import optionsIcon from "./assets/options_icon.svg";
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

const ExitArrow = ({ route }) => (
	<button className={styles.exitArrow} onClick={() => route.push("/chat")}>
		<Image
			className={styles.exitArrow_Image}
			width={100}
			height={100}
			src={exitArrow}
			alt="exit arrow"
		/>
	</button>
);

const InviteToPlay = () => (
	<div className="w-52 h-full grid place-content-center">
		<button className="bg-[#E1E1E1] w-40 h-10 rounded-3xl">
			<span className="text-black font-bold text-lg">Invite To Play</span>
		</button>
	</div>
);

export function ProfileBar({ name, profileImg, activeStatus, onOpenProfile }) {
	const route = useRouter();

	return (
		<div className={styles.container}>
			<ExitArrow route={route} />
			<div className={styles.profileBar}>
				<button onClick={onOpenProfile}>
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
			<InviteToPlay />
		</div>
	);
}
