import styles from "./cardpic.module.css";
import Image from "next/image";
import Fooo from "../images/made.svg";
import Link from "next/link";

const Cardpic = () => {
	return (
		<div>
			<div className={`${styles.container}`}>
				<div className={styles.title}>Mode</div>
				<div className={`${styles.bor}`}>
					<Link href="game/choice">
						<div className={styles.all_in}>
							<div
								className={`${styles.card} ${styles.bot}`}
							></div>
							<span className={styles.sp}>local</span>
						</div>
					</Link>

					<Link href="game/online_game">
						<div className={styles.all_in}>
							<div
								className={`${styles.card} ${styles.friend}`}
							></div>
							<span className={styles.sp}>online</span>
						</div>
					</Link>
				</div>
				<div
					className={`${styles.made} [@media(max-width:1014px)]:hidden`}
				>
					<Image src={Fooo} width={200} height={89} alt="immmm" />
				</div>
			</div>
		</div>
	);
};

export default Cardpic;
