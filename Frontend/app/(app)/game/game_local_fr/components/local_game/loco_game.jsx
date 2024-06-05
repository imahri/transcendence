"use client";
import styles from "./LGame.module.css";
import React, { useEffect, useState } from "react";
import { Gameson } from "./lgame";
import Res from "./res";
import { APIs } from "@/Tools/fetch_jwt_client";
import Image from "next/image";

const LGame = ({ checkEnd, boardpic }) => {
	const [playerOne, setPlayerone] = useState(0);
	const [playerTwo, setPlayertwo] = useState(0);
	console.log(boardpic);
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
							<div className={`${styles.borad}`}>
								<div className={styles.borad_picture}>
									<Image
										src={APIs.image(boardpic)}
										height={100}
										width={200}
										className={`${styles.player_picture}`}
										alt="Profile image"
									/>
								</div>
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
