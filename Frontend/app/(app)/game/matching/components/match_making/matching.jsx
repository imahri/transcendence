import { Linden_Hill } from "next/font/google";
import styles from "./matching.module.css";
import Boardskin from "@/app/(app)/game/matching/components/match_making/board_skin";
import Ready from "@/app/(app)/game/matching/components/match_making/ready";
import Random from "@/app/(app)/game/matching/components/match_making/random";
import Link from "next/link";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import React, { useEffect, useRef, useState, useContext } from "react";
import { UserContext } from "@/app/(app)/context";
import Image from "next/image";
import { APIs } from "@/Tools/fetch_jwt_client";

var count;

function getOtherPlayer(player1, player2, user) {
	if (!player1 || !player2) return null;

	if (user.username == player1.username) return player2;
	return player1;
}

const Matching = ({ player1, player2 }) => {
	const { user } = useContext(UserContext);

	const other = getOtherPlayer(player1, player2, user);

	return (
		<div className="">
			<div className={styles.page}>
				<div className={styles.layers}>
					<div className={`${styles.layer} ${styles.zero}`}>
						{/* nav */}
					</div>

					<div className={`${styles.layer} ${styles.smal}`}></div>

					<div className={`${styles.layer} ${styles.first}`}>
						{/* game */}
						<span>game</span>
					</div>

					<div className={`${styles.layer} ${styles.two}`}>
						{/* 1vs1 */}

						<div className={styles.asembler}>
							<div className={`${styles.first_player}`}>
								<div className={`${styles.player_pic}`}>
									<Image
										src={APIs.image(user.img)}
										height={100}
										width={200}
										className={`${styles.player_picture}`}
										alt="Profile image"
									/>
								</div>
								<div className={`${styles.username}`}>
									{user.username}
								</div>
							</div>

							<div className={styles.versus}>vs</div>

							<div className={`${styles.first_player}`}>
								<div className={`${styles.player_pic}`}>
									{other ? (
										<Image
											src={APIs.image(other.image)}
											height={100}
											width={200}
											className={`${styles.player_picture}`}
											alt="Profile image"
										/>
									) : (
										<Random />
									)}
								</div>
								<div className={`${styles.username}`}>
									{other ? other.username : "XXXXXX"}
								</div>
								{/* <div className={`${styles.exp}`}>
									2564789 exp
								</div> */}
							</div>
						</div>
					</div>

					{/* choice */}
					{/* <div className={`${styles.layer} ${styles.four}`}>
						<div className={styles.choice_container}>
							<div
								className={`${styles.boxes} ${styles.box_pic1}`}
							>
								<div className={styles.box_overall}></div>
							</div>
							<div
								className={`${styles.boxes} ${styles.box_pic2}`}
							>
								<div className={styles.box_overall}></div>
							</div>
							<div
								className={`${styles.boxes} ${styles.box_pic3}`}
							>
								<div className={styles.box_overall}></div>
							</div>
						</div>
					</div> */}

					<div className={`${styles.layer} ${styles.five}`}>
						{/* borad */}

						<div className={styles.container_board}>
							<div className={styles.badge}></div>
							<Boardskin />
							<div className={styles.badge}></div>
						</div>
					</div>
					<div className={`${styles.layer} ${styles.smal}`}></div>

					<div className={`${styles.layer}`}>
						{/* achivement */}

						<div className={`${styles.achivement_container}`}>
							<div className={styles.parent}>
								<Link href="/game">
									<button className={styles.back}>
										Back
									</button>
								</Link>
							</div>

							<div className={`${styles.achivement_asmbler}`}>
								<div className={`${styles.pico}`}></div>
								<span>win 15 match in your last chance</span>
							</div>
						</div>
					</div>

					<div className={`${styles.layer}`}></div>
				</div>
			</div>
		</div>
	);
};

export default Matching;
