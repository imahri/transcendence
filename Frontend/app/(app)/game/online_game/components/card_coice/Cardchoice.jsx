import styles from "./cardchoice.module.css";
import Link from "next/link";

const Cardchoice = () => {
	return (
		<div>
			<div className={styles.page}>
				<div className={styles.rows_exac}></div>

				<div className={`${styles.rows_exac} ${styles.titles}`}>
					Game
				</div>
				<div className={`${styles.rows_exac} ${styles.fliko}`}>
					<div className={styles.content}>


						<Link href={"/tournament"} className={`${styles.item}`}>
							<div className={`${styles.card} ${styles.third}`}>
								<p className={`${styles.graf}`}>Tournament</p>
							</div>
							<span
								className={`${styles.ti_n} ${styles.lastOne}`}
							>
								Tournament
							</span>

							<div className={styles.shad}></div>
						</Link>
					</div>
				</div>

				<div className={styles.rows_exac}></div>
				<div className={styles.rows_exac}></div>
			</div>
		</div>
	);
};

export default Cardchoice;
