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

const Label = ({ _key, value }) => (
	<div className="flex flex-col justify-center items-start ml-20">
		<h3 className="text-[#a9a8a8] font-light text-2xl">{_key}</h3>
		<h4 className="pl-4 text-gray-300 font-semibold text-2xl">{value}</h4>
	</div>
);

const BadgeSection = ({ Grade }) => (
	<>
		<Label _key={"Grade"} />
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
	</>
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
			</section>
			<Separator className="h-[2px] w-80 bg-black" />
			<section className={styles.profile_section}>
				<div className="flex">
					<Label _key={"Nickname"} value={Nickname} />
					<Label _key={"Wallet"} value={Wallet} />
				</div>
				<Label _key={"Email"} value={Email} />
				<BadgeSection Grade={Grade} />
			</section>
			<Separator className="h-[2px] w-80 bg-black" />
			<Footer />
		</div>
	);
}
