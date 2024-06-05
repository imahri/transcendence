import styles from "./rank.module.css";
import Image from "next/image";
import { APIs } from "@/Tools/fetch_jwt_client";

const Player_rank = ({ idx, info: { username, level, grade_img, exp } }) => {
	return (
		<div className={styles.head}>
			<div className={styles.pack}>{idx + 1}</div>
			<div className={styles.pack}>{username}</div>
			<div className={styles.pack}>{level}</div>
			<div className={`${styles.pack}`}>
				<Image
					src={APIs.image(grade_img)}
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
