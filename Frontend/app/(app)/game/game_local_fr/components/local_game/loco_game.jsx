"use client";
import styles from "./LGame.module.css";
import React, { useEffect, useState } from "react";
import { Gameson } from "./lgame";
import Res from "./res";

const LGame = ({ checkEnd }) => {
	const [playerOne, setPlayerone] = useState(0);
	const [playerTwo, setPlayertwo] = useState(0);

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
									<Gameson
										setPlayerone={setPlayerone}
										setPlayertwo={setPlayertwo}
										checkEnd={checkEnd}
									/>
								</div>
							</div>
							<Res playerOne={playerOne} playerTwo={playerTwo} />
						</div>
					</div>
				</div>
				<div className={`${styles.layer} ${styles.third}`}></div>
			</div>
		</div>
	);
};

export default LGame;
