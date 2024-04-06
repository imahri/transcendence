import { Separator } from "../../../Components/Separator";
import { DummyPath } from "../../../DummyData";
import styles from "./styles/ProfileSection.module.css";
import Image from "next/image";
import badge from "./assets/badge.svg";

function Footer() {
	return (
		<div className={styles.footer}>
			<h6>From</h6>
			<h5>Paddle Ghost</h5>
		</div>
	);
}

function Label({ _key, value }) {
	return (
		<div className="flex flex-col justify-center items-start ml-20">
			<h3 className="text-[#a9a8a8] font-light text-2xl">{_key}</h3>
			<h4 className="pl-4 text-gray-300 font-semibold text-2xl">
				{value}
			</h4>
		</div>
	);
}

export function ProfileSection({ FriendInfo }) {
	return (
		<div className={styles.container}>
			<div className={styles.profile}>
				<div className={styles.profile_img_container}>
					<Image
						className={styles.profile_img}
						src={DummyPath}
						width={200}
						height={200}
						alt="profile_img"
					/>
				</div>
				<h1>{FriendInfo.name}</h1>
				<small>{FriendInfo.status}</small>
			</div>
			<Separator className="h-[2px] w-80 bg-black my-5" />
			<section className={styles.profile_section}>
				<div className="flex">
					<Label _key={"Nickname"} value={"obmium"} />
					<Label _key={"Wallet"} value={"150 $"} />
				</div>
				<Label _key={"Email"} value={"walid.obm95@gmail.com"} />
				<Label _key={"Grade"} value={"bronze"} />
				<Label _key={"Badge"} />
				<div className={styles.badge_section}>
					<Image
						className={styles.badge_section_img}
						src={badge}
						width={500}
						height={500}
						alt="badge"
					/>
				</div>
			</section>
			<Separator className="h-[2px] w-80 bg-black my-2" />
			<Footer />
		</div>
	);
}
