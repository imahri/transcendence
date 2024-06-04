import styles from "./cardchoice.module.css";
import Image from "next/image";
import Link from "next/link";

const Cardchoice = () => {
	return (
		<div>
			<div className={styles.page}>
				{/* page */}
				<div className={styles.rows_exac}></div>

				<div className={`${styles.rows_exac} ${styles.titles}`}>
					Game
				</div>
				<div className={`${styles.rows_exac} ${styles.fliko}`}>
					<div className={styles.content}>
						<div className={`${styles.item}`}>
							<div className={`${styles.card} ${styles.first}`}>
								<p className={`${styles.graf}`}>Ninjutsu</p>
							</div>
							<span className={styles.ti_n}>Ninjutsu</span>

							<div className={styles.shad}></div>
						</div>

						<div className={`${styles.item}`}>
							<div
								className={`${styles.card} ${styles.second} ${styles.middle_it}`}
							>
								<Link
									href="/game/game_local_fr"
									className={styles.lunin}
								></Link>
								<p className={`${styles.graf}`}>Loco</p>
							</div>
							<span className={styles.ti_n}>Classic</span>
							<div className={styles.shad}></div>
						</div>

						<Link
							href={"/game/game_local"}
							className={`${styles.item}`}
						>
							<div className={`${styles.card} ${styles.third}`}>
								<p className={`${styles.graf}`}>Bot</p>
							</div>

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
