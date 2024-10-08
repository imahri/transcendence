"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import styles from "./styles/ProfileBar.module.css";
import ExitArrowIcon from "./assets/exit_arrow_icon";
import { useRouter } from "next/navigation";
import { APIs } from "@/Tools/fetch_jwt_client";
import { UserContext } from "@/app/(app)/context";

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
			<h3 className="xs:hidden sm:hidden">{status}</h3>
		</div>
	);
}

const ExitArrow = ({ onExit }) => (
	<button className={styles.exitArrow} onClick={onExit}>
		<ExitArrowIcon className={styles.exitArrow_Image} />
	</button>
);

function invit(ws, username, setInvit) {
	const notif = {
		to: username,
		type: "G",
		content: {
			type: "invit",
		},
	};

	ws.send(
		JSON.stringify({
			action: "send_notif",
			content: notif,
		}),
	);
	setInvit(true);
}

const InviteToPlay = ({ name }) => {
	const { ws } = useContext(UserContext);
	const [invited, setInvit] = useState();

	return (
		<div className="w-52 h-full grid place-content-center">
			<button
				className={`${invited ? "opacity-60 cursor-not-allowed" : ""} bg-[#E1E1E1] w-40 h-10 rounded-3xl`}
				onClick={() => invit(ws, name, setInvit)}
				disabled={invited ? true : false}
			>
				<span
					className={`${invited ? "opacity-60" : ""} text-black font-bold text-lg`}
				>
					{invited ? "Invited" : "Invite To Play"}
				</span>
			</button>
		</div>
	);
};

export function ProfileBar({
	friendinfo: { name, image },
	activeStatus,
	onOpenProfile,
}) {
	const route = useRouter();

	return (
		<div className={styles.container}>
			<ExitArrow onExit={() => route.push("/chat")} />
			<div className={styles.profileBar}>
				<button onClick={onOpenProfile}>
					{image && (
						<Image
							className={styles.profileBar_Image}
							width={100}
							height={100}
							src={APIs.image(image)}
							alt="Profile image"
						/>
					)}
					<section className={styles.profileInfo}>
						<h2 className="xs:hidden sm:hidden">{name}</h2>
						<Status status={activeStatus} />
					</section>
				</button>
			</div>
			<InviteToPlay name={name} />
		</div>
	);
}
