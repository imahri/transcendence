import styles from "./LGame.module.css";
import Image from "next/image";
import Link from "next/link";
import Aup from "../images/up.svg";
import Ado from "../images/down.svg";
import Son from "../images/sound.svg";
import Soff from "../images/mute.svg";
import Mon from "../images/music.svg";
import Moff from "../images/no_sound.svg";

const LGame = () => {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={`${styles.layer} ${styles.first}`}></div>
				<div className={`${styles.layer} ${styles.title}`}>
					<h2>Live</h2>
				</div>
				<div className={`${styles.layer} ${styles.second}`}>
					<div className={styles.all_in}>
						<div className={styles.bord_part}>
							<div className={styles.borad}></div>
							<div className={styles.score}></div>
						</div>

						<div className={styles.mode_part}>
							<div className={styles.all_in_two}>
								<h1 className={styles.mode_title}>Mode</h1>
								<h2 className={styles.cla_title}>Classic</h2>
								<div className={styles.box}></div>
								<div className={styles.but}>
									<div className={styles.bazoka}>
										Bazoooooka
									</div>
								</div>
								<div className={styles.tool_box}>
									<div className={styles.tool_box_right}>
										<span>up</span>
										<div className={styles.tool_box_but}>
											<div className={styles.inside}>
												<img
													src="../images/music.svg"
													alt=""
												/>
												<Image
													src={Aup}
													width={15}
													height={15}
													alt="immmm"
												/>
											</div>
											<div className={styles.inside}>
												W
											</div>
										</div>
										{/* <div className={styles.sound}>
												<Image className={styles.Image} src={Mon} width={15} height={15} alt="immmm" />
												<Image className={styles.Image} src={Moff} width={25} height={25} alt="immmm" />
										</div> */}
									</div>
									<div className={styles.tool_box_right}>
										<span>down</span>
										<div className={styles.tool_box_but}>
											<div className={styles.inside}>
												<img
													src="../images/music.svg"
													alt=""
												/>
												<Image
													src={Ado}
													width={15}
													height={15}
													alt="immmm"
												/>
											</div>
											<div className={styles.inside}>
												S
											</div>
										</div>
										{/* <div className={styles.sound}>
												<Image className={styles.Image} src={Son} width={25} height={25} alt="immmm" />
												<Image className={styles.Image} src={Soff} width={25} height={25} alt="immmm" />
										</div> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={`${styles.layer} ${styles.third}`}></div>
			</div>
		</div>
	);
};

export default LGame;
