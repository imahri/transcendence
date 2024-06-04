import Image from "next/image";
import styles from "./LGame.module.css";
import { APIs } from "@/Tools/fetch_jwt_client";
import { UserContext } from "@/app/(app)/context";
import React, { useEffect, useRef, useState, useContext } from "react";
import op from "@/app/(app)/game/game_local_fr/components/images/oponent.png";

const Res = ({ playerOne, playerTwo }) => {
	const { user } = useContext(UserContext);
	return (
		<div className={styles.score}>
			<div className={styles.score_first}></div>
			<div className={styles.players}>
				<div className={styles.fi_players}>
					<div className={styles.pr_player}>
						<Image
							src={APIs.image(user.info.profile_img)}
							height={100}
							width={200}
							className={`${styles.player_picture}`}
						/>
					</div>
					<div className={styles.sc_player}>{playerTwo}</div>
				</div>
				<span className={styles.versus}>VS</span>
				<div className={styles.se_players}>
					<div className={styles.pr_player}>
						<Image
							src={op}
							height={100}
							width={200}
							className={`${styles.player_picture}`}
						/>
					</div>
					<div className={styles.sc_player}>{playerOne}</div>
				</div>
			</div>
		</div>
	);
};

export default Res;
