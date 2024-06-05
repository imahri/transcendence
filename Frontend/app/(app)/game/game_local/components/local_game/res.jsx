import Image from "next/image";
import styles from "./LGame.module.css";
import React, { useEffect, useRef, useState, useContext } from "react";
import { APIs } from "@/Tools/fetch_jwt_client";
import { UserContext } from "@/app/(app)/context";
import bot from "../images/bot.png";

const Res = ({ botScore, userScore }) => {
	const { user } = useContext(UserContext);
	return (
		<div className={styles.score}>
			<div className={styles.score_first}></div>
			<div className={styles.players}>
				<div className={styles.fi_players}>
					<div className={styles.pr_player}>
						<Image
							src={APIs.image(user.img)}
							height={100}
							width={200}
							className={`${styles.player_picture}`}
							alt="Profile image"
						/>
					</div>
					<div className={styles.sc_player}>{userScore}</div>
				</div>
				<span className={styles.versus}>VS</span>
				<div className={styles.se_players}>
					<div className={styles.pr_player}>
						<Image
							src={bot}
							height={100}
							width={200}
							className={`${styles.player_picture}`}
							alt="Profile image"
						/>
					</div>
					<div className={styles.sc_player}>{botScore}</div>
				</div>
			</div>
		</div>
	);
};

export default Res;
