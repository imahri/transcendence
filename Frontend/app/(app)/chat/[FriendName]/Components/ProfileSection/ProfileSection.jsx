import { Separator } from "../../../Components/Separator";
import { DummyPath } from "../../../DummyData";
import styles from "./styles/ProfileSection.module.css";
import Image from "next/image";
import badge from "./assets/badge.svg";

import g_bronze from "./assets/g_bronze.svg";
import g_silver from "./assets/g_silver.svg";
import g_gold from "./assets/g_gold.svg";
import g_platinum from "./assets/g_platinum.svg";
import g_master from "./assets/g_master.svg";
import g_grandmaster from "./assets/g_grandmaster.svg";

export const Grades = [
	{ grade: "bronze", image: g_bronze },
	{ grade: "silver", image: g_silver },
	{ grade: "gold", image: g_gold },
	{ grade: "platinum", image: g_platinum },
	{ grade: "master", image: g_master },
	{ grade: "grandmaster", image: g_grandmaster },
];

const Footer = () => (
	<div className={styles.footer}>
		<h6>From</h6>
		<h5>Paddle Ghost</h5>
	</div>
);

const BadgeSection = ({ Grade }) => (
	<div className={styles.badge_section}>
		<Image
			className={styles.badge_section_img}
			src={badge}
			width={500}
			height={500}
			alt="badge"
		/>
		<ul className={styles.badge_section_list}>
			{Grades.map(({ image }, idx) => (
				<li key={idx}>
					<Image
						className={`w-14 h-14 ${Grade <= idx && "grayscale"}`}
						src={image}
						width={200}
						height={200}
						alt="badge"
					/>
				</li>
			))}
		</ul>
	</div>
);

const Profile_Icon = () => (
	<div className={styles.svg_container}>
		<svg
			width="22"
			height="22"
			viewBox="0 0 22 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 17.901C1 16.6204 1.50874 15.3921 2.41431 14.4866C3.31988 13.581 4.5481 13.0723 5.82876 13.0723H15.4863C16.767 13.0723 17.9952 13.581 18.9007 14.4866C19.8063 15.3921 20.3151 16.6204 20.3151 17.901C20.3151 18.5414 20.0607 19.1555 19.6079 19.6083C19.1551 20.061 18.541 20.3154 17.9007 20.3154H3.41438C2.77405 20.3154 2.15994 20.061 1.70716 19.6083C1.25437 19.1555 1 18.5414 1 17.901Z"
				stroke="white"
				stroke-width="2"
				stroke-linejoin="round"
			/>
			<path
				d="M10.6577 8.24314C12.6578 8.24314 14.2793 6.62171 14.2793 4.62157C14.2793 2.62143 12.6578 1 10.6577 1C8.65757 1 7.03613 2.62143 7.03613 4.62157C7.03613 6.62171 8.65757 8.24314 10.6577 8.24314Z"
				stroke="white"
				stroke-width="2"
			/>
		</svg>
	</div>
);

const Block_Icon = () => (
	<div className={styles.svg_container}>
		<svg
			width="28"
			height="29"
			viewBox="0 0 28 29"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M13.766 25.8281C19.7057 25.8281 24.5208 20.7563 24.5208 14.5C24.5208 8.24365 19.7057 3.17188 13.766 3.17188C7.8263 3.17188 3.01123 8.24365 3.01123 14.5C3.01123 20.7563 7.8263 25.8281 13.766 25.8281Z"
				stroke="white"
				stroke-width="2"
				stroke-miterlimit="10"
			/>
			<path d="M6.16138 6.48999L21.3708 22.5102Z" fill="white" />
			<path
				d="M6.16138 6.48999L21.3708 22.5102"
				stroke="white"
				stroke-width="2"
				stroke-miterlimit="10"
			/>
		</svg>
	</div>
);

export function ProfileSection({ FriendInfo }) {
	const profile_img = DummyPath;
	const Nickname = "obmium";
	const Wallet = "150 $";
	const Email = "walid.obm95@gmail.com";
	const Grade = 2;

	return (
		<div className={styles.container}>
			<section className={styles.profile}>
				<div className={styles.profile_img_container}>
					<Image
						className={styles.profile_img}
						src={profile_img}
						width={200}
						height={200}
						alt="profile_img"
					/>
				</div>
				<h1>{FriendInfo.name}</h1>
				<small>{FriendInfo.status}</small>
				<div className="w-full flex justify-evenly items-center text-white font-medium text-xs mt-5">
					<button className={styles.flex_col_container}>
						<Profile_Icon />
						<span>View Profile</span>
					</button>
					<button className={styles.flex_col_container}>
						<Block_Icon />
						<span>Block</span>
					</button>
				</div>
			</section>
			<section className={styles.profile_section}>
				<BadgeSection Grade={Grade} />
			</section>
			<Footer />
		</div>
	);
}
