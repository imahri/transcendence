"use client";
import styles from "./LGame.module.css";
import React, { useEffect, useState } from "react";
import { Gameson } from "./lgame";
import Res from "./res";

const LGame = ({ checkWinner, checkLoser }) => {
	const [botScore, setBotScore] = useState(0);
	const [userScore, setUserScore] = useState(0);
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
										setBotScore={setBotScore}
										setUserScore={setUserScore}
										checkWinner={checkWinner}
										checkLoser={checkLoser}
									/>
								</div>
							</div>
							<Res botScore={botScore} userScore={userScore} />
						</div>
					</div>
				</div>
				<div className={`${styles.layer} ${styles.third}`}></div>
			</div>
		</div>
	);
};

export default LGame;
