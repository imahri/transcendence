import React from "react";
import styles from "./styles/ProfileBar.module.css";
import optionsIcon from "/Chat_assets/options_icon.svg";

const DummyPath =
	"https://24ai.tech/en/wp-content/uploads/sites/3/2023/08/24ai_try_chair-1-150x150.webp";

const FriendData = {
	name: "David red",
	isActive: true,
	profileImage: DummyPath,
};

function Status({ isActive }) {
	return (
		<div
			className={`${styles.status} ${isActive ? "bg-green-400" : "bg-red-700"}`}
		></div>
	);
}

// TODO: using friendName get FriendData
export default function ProfileBar({ friendName }) {
	const status = FriendData.isActive ? "Active Now" : "Machi Active Now";

	const openProfileSection = () => {};

	return (
		<div className={styles.container}>
			<button onClick={openProfileSection} className={styles.profileBar}>
				<img src={FriendData.profileImage} />
				<section className={styles.profileInfo}>
					<h2>{friendName}</h2>
					<h3>{status}</h3>
				</section>
				<Status isActive={true} /> {/* get status from FriendData */}
			</button>
			<div className={styles.options}>
				<button>
					<img src={optionsIcon} alt="options icon" />
				</button>
			</div>
		</div>
	);
}
