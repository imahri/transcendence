import styles from "./LGame.module.css";
import Image from "next/image";
import Link from "next/link";
import Aup from "../images/up.svg";
import Ado from "../images/down.svg";
import Son from "../images/sound.svg";
import Soff from "../images/mute.svg";
import Mon from "../images/music.svg";
import Moff from "../images/no_sound.svg";
import { Gameson } from "./game";
import Res from "./res";

const LGame = ({
	secondArrived,
	loading,
	checkWinner,
	win,
	checkLoser,
	lose,
}) => {
	return (
		<div className={`${styles.page} ${loading ? "hidden" : "block"}`}>
			<div className={styles.container}>
				<div className={`${styles.layer} ${styles.first}`}></div>
				<div className={`${styles.layer} ${styles.title}`}>
					<h2>Live</h2>
				</div>
				<div className={`${styles.layer} ${styles.second}`}>
					<div className={styles.all_in}>
						<div className={styles.bord_part}>
							<div className={styles.borad}>
								<Gameson
									checkWinner={checkWinner}
									checkLoser={checkLoser}
									secondArrived={secondArrived}
								/>
							</div>
							<Res />
							{/* <div className={styles.all_ferno}>
								<div className={styles.ferno}>Bazoooooka</div>
							</div> */}
						</div>

						{/* <div className={styles.mode_part}>
							<div className={styles.all_in_two}>
								<h1 className={styles.mode_title}>Mode</h1>
								<h2 className={styles.cla_title}>Classic</h2>

								<div className={styles.box}>
									<div className={styles.profile}></div>
									<span>FiddlerX</span>
									<p>Mahri Imad-eddine</p>
								</div>

								<div className={styles.but}>
									<div className={styles.bazoka}>
										Bazoooooka
									</div>
								</div>
							</div>
						</div> */}
					</div>
				</div>
				<div className={`${styles.layer} ${styles.third}`}></div>
			</div>
		</div>
	);
};

export default LGame;
