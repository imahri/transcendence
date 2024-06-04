import styles from "./rank.module.css";
import Image from "next/image";
import first_grade from "../images/first.svg";
import { IMAGE_URL } from "@/app/URLS";

const Player_rank = ({ idx, info: { username, level, grade_img, exp } }) => {
	return (
		<div className={styles.head}>
			<div className={styles.pack}>{idx}</div>
			<div className={styles.pack}>{username}</div>
			<div className={styles.pack}>{level}</div>
			<div className={`${styles.pack}`}>
				<Image
					src={`${IMAGE_URL}?path=${grade_img}`}
					width={50}
					height={100}
					alt="grade badge"
					className={styles.pictu}
				/>
			</div>
			<div className={styles.pack}>{exp}</div>
		</div>
	);
};

export default Player_rank;
