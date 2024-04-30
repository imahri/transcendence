import styles from "./LGame.module.css";
import Image from "next/image";
import Link from "next/link";
import Aup from "../images/up.svg";
import Ado from "../images/down.svg";
import Son from "../images/sound.svg";
import Soff from "../images/mute.svg";
import Mon from "../images/music.svg";
import Moff from "../images/no_sound.svg";
import { Youchen } from "./game";

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
							<div className={styles.borad}>
								<div className={styles.borad_cover}></div>
								<div className={styles.f_borad_line}></div>
								<div className={styles.s_borad_line}></div>
								<div className={styles.t_borad_line}></div>
								<div className={styles.l_borad_line}></div>
								<div className={styles.ppo}>
									<Youchen />
								</div>
							</div>
							<div className={styles.score}>
								<div className={styles.score_first}></div>
								<div className={styles.players}>
									<div className={styles.fi_players}>
										<div className={styles.pr_player}></div>
										<div className={styles.sc_player}>
											3
										</div>
									</div>
									<span className={styles.versus}>VS</span>
									<div className={styles.se_players}>
										<div className={styles.pr_player}></div>
										<div className={styles.sc_player}>
											3
										</div>
									</div>
								</div>
							</div>
							<div className={styles.all_ferno}>
								<div className={styles.ferno}>Bazoooooka</div>
							</div>
						</div>

						<div className={styles.mode_part}>
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
								<div className={styles.tool_box}>
									<div className={styles.tool_box_right}>
										<span>up</span>
										<div className={styles.tool_box_but}>
											<div className={styles.inside}>
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
									</div>
									<div className={styles.tool_box_right}>
										<span>down</span>
										<div className={styles.tool_box_but}>
											<div className={styles.inside}>
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
