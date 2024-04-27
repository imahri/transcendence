import styles from "./cardpic.module.css";
import Image from "next/image";
import Fooo from "../images/made.svg";
import Link from "next/link";

const Cardpic = () => {
	return (
		<div>
			<div className={`${styles.top_f}`}></div>

			<div className={`${styles.container}`}>
				<div className={styles.title}>Mode</div>
				<div className={`${styles.bor}`}>
					<div className={styles.all_in}>
						<div className={`${styles.card} ${styles.bot}`}></div>
						<span className={styles.sp}>Bot</span>
					</div>
					<Link href="/choice">
						<div className={styles.all_in}>
							<div
								className={`${styles.card} ${styles.friend}`}
							></div>
							<span className={styles.sp}>friend</span>
						</div>
					</Link>
				</div>
				<div className={`${styles.made}`}>
					<Image src={Fooo} width={337} height={89} alt="immmm" />
				</div>
			</div>
		</div>
	);
};

export default Cardpic;
