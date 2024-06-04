import styles from "./rank.module.css";
import Image from "next/image";
import first_grade from "../images/first.svg";
import { IMAGE_URL } from "@/app/URLS";

const Player_rank = ({ idx, info: { username, level, grade_img, exp } }) => {
	return (
		<tr>
			<td className={`${styles.tco} ${styles.paco}`}>{idx}</td>
			<td className={styles.tco}>{username}</td>
			<td className={styles.tco}>{level}</td>
			<td className={`${styles.tco} w-10`}>
				<Image
					src={`${IMAGE_URL}?path=${grade_img}`}
					width={200}
					height={200}
					alt="grade badge"
				/>
			</td>
			<td className={styles.tco}>{exp}</td>
		</tr>
	);
};

export default Player_rank;
