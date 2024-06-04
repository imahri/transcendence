import Image from "next/image";
import styles from "./LGame.module.css";
import React, { useEffect, useRef, useState, useContext } from "react";
import { UserContext } from "@/app/(app)/context";
import bot from "../images/bot.png";
import { APIs } from "@/Tools/fetch_jwt_client";

const Res = ({ score, player1, player2 }) => {
	// const { user } = useContext(UserContext);
	return (
		<div className={styles.score}>
			<div className={styles.score_first}></div>
			<div className={styles.players}>
				<div className={styles.fi_players}>
					<div className={styles.pr_player}>
						<Image
							src={APIs.image(player1.image)}
							height={100}
							width={200}
							className={`${styles.player_picture}`}
						/>
					</div>
					<div className={styles.sc_player}>{score.score1}</div>
				</div>
				<span className={styles.versus}>VS</span>
				<div className={styles.se_players}>
					<div className={styles.pr_player}>
						<Image
							src={APIs.image(player2.image)}
							height={100}
							width={200}
							className={`${styles.player_picture}`}
						/>
					</div>
					<div className={styles.sc_player}>{score.score2}</div>
				</div>
			</div>
		</div>
	);
};

export default Res;
