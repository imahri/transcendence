import Image from 'next/image'
import React from "react";
import styles from "./styles/ProfileBar.module.css";
import optionsIcon from "./assets/options_icon.svg";

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
				<Image className={styles.profileBar_Image} width={100} height={100} src={FriendData.profileImage} alt='Profile image' />
				<section className={styles.profileInfo}>
					<h2>{friendName}</h2>
					<h3>{status}</h3>
				</section>
				<Status isActive={true} /> {/* get status from FriendData */}
			</button>
			<div className={styles.options}>
				<button>
					<Image className={styles.options_Image} width={100} height={100} src={optionsIcon} alt="options icon" />
				</button>
			</div>
		</div>
	);
}
