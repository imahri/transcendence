import styles from "./matching.module.css";
import Paddle from "@/app/(app)/game/matching/components/match_making/paddle";
import Ball from "@/app/(app)/game/matching/components/match_making/ball_it";
import Image from "next/image";
import { APIs } from "@/Tools/fetch_jwt_client";

const Boardskin = ({ boardpic }) => {
	return (
		<div className={styles.bord}>
			<div className={styles.board_holder}>
				<Image
					src={APIs.image(boardpic)}
					height={100}
					width={200}
					alt="board"
					className={styles.board_pic}
				/>
			</div>
			<Paddle className={`${styles.ppad} ${styles.left_paddle}`} />
			<Paddle className={`${styles.ppad} ${styles.rigth_paddle}`} />
			<Ball />
		</div>
	);
};

export default Boardskin;
