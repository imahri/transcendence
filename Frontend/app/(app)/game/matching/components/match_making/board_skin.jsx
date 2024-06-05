import styles from "./matching.module.css";
import Paddle from "@/app/(app)/game/matching/components/match_making/paddle";
import Ball from "@/app/(app)/game/matching/components/match_making/ball_it";

const Boardskin = () => {
	return (
		<div className={styles.bord}>
			<div className={styles.box_overall}></div>
			<Paddle className={`${styles.ppad} ${styles.left_paddle}`} />
			<Paddle className={`${styles.ppad} ${styles.rigth_paddle}`} />
			<Ball />
		</div>
	);
};

export default Boardskin;
