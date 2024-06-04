import styles from "./styles/ProfileSection.module.css";
import Image from "next/image";
import g_bronze from "./assets/g_bronze.svg";
import g_silver from "./assets/g_silver.svg";
import g_gold from "./assets/g_gold.svg";
import g_platinum from "./assets/g_platinum.svg";
import g_master from "./assets/g_master.svg";
import g_grandmaster from "./assets/g_grandmaster.svg";
import { useRouter } from "next/navigation";
import { BlockIcon } from "./icons/BlockIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { UserContext } from "@/app/(app)/context";
import { useContext } from "react";
import { ActiveStatusTypes } from "../ProfileBar";
import { APIs } from "@/Tools/fetch_jwt_client";

export const Grades = [
	{ grade: "bronze", image: g_bronze },
	{ grade: "silver", image: g_silver },
	{ grade: "gold", image: g_gold },
	{ grade: "platinum", image: g_platinum },
	{ grade: "master", image: g_master },
	{ grade: "grandmaster", image: g_grandmaster },
];

const FriendProfile = ({ image, name, status }) => (
	<div className="flex justify-center items-center flex-col space-y-4 md:space-y-1">
		<div className={styles.profile_img_container}>
			{image && (
				<Image
					className={styles.profile_img}
					src={APIs.image(image)}
					width={200}
					height={200}
					alt="profile_img"
				/>
			)}
		</div>
		<h1>{name}</h1>
		<small
			className={
				status === ActiveStatusTypes.Active
					? "text-green-400"
					: "text-red-500"
			}
		>
			{status}
		</small>
	</div>
);

function BlockUser(ws, friend_id) {
	const content = { action: "block", friend_id: friend_id };
	ws.send(JSON.stringify({ action: "set_friendship", content: content }));
}

const Options = ({ name, id }) => {
	const router = useRouter();
	const { ws } = useContext(UserContext);

	return (
		<div className="w-full flex justify-evenly items-center text-white font-medium text-xs mt-5">
			<button
				onClick={() => router.push(`/profile/${name}`)}
				className={styles.flex_col_container}
			>
				<ProfileIcon />
				<span>View Profile</span>
			</button>
			<button
				className={styles.flex_col_container}
				onClick={() => {
					if (id) {
						console.log(id);
						BlockUser(ws, id);
					}
				}}
			>
				<BlockIcon />
				<span>Block</span>
			</button>
		</div>
	);
};

const BadgeSection = ({ Grade }) => (
	<section className={styles.profile_section}>
		<div className={styles.badge_section}>
			<Image
				className={styles.badge_section_img}
				src={Grades[Grade - 1].image}
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
	</section>
);

const Footer = () => (
	<div className={styles.footer}>
		<h6>From</h6>
		<h5>Paddle Ghost</h5>
	</div>
);

export const ProfileSection = ({
	_ref,
	className,
	friendinfo: { id, name, image, grade },
	status,
}) => (
	<div ref={_ref} className={`${styles.container} ${className}`}>
		<div className="w-full h-full flex flex-col justify-evenly">
			<section className={styles.profile}>
				<FriendProfile image={image} name={name} status={status} />
				<Options name={name} id={id} />
			</section>
			<BadgeSection Grade={grade > 0 ? grade : 1} />
		</div>
		<Footer />
	</div>
);
