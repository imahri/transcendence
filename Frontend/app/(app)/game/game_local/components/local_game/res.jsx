import React from "react";
import styles from "./LGame.module.css";
import { useState, useEffect } from "react";
const Res = ({ botScore, userScore }) => {
	return (
		<div className={styles.score}>
			<div className={styles.score_first}></div>
			<div className={styles.players}>
				<div className={styles.fi_players}>
					<div className={styles.pr_player}></div>
					<div className={styles.sc_player}>{userScore}</div>
				</div>
				<span className={styles.versus}>VS</span>
				<div className={styles.se_players}>
					<div className={styles.pr_player}></div>
					<div className={styles.sc_player}>{botScore}</div>
				</div>
			</div>
		</div>
	);
};

export default Res;
