import styles from "./rank.module.css";
import Image from "next/image";
import first_grade from "../images/first.svg";

const Player_rank = () => {
	return (
		<tr>
			<td className={`${styles.tco} ${styles.paco}`}>1</td>
			<td className={styles.tco}>Malcolm Lockyer</td>
			<td className={styles.tco}>5.30</td>
			<td className={styles.tco}>qwerty</td>
			<td className={styles.tco}>1235</td>
			<td className={`${styles.tco} ${styles.histo}`}>
				<div className={`${styles.m_first} ${styles.box_histo}`}></div>
				<div className={`${styles.m_second} ${styles.box_histo}`}></div>
				<div className={`${styles.m_third} ${styles.box_histo}`}></div>
				<div className={`${styles.m_fourth} ${styles.box_histo}`}></div>
			</td>
		</tr>
	);
};

export default Player_rank;
