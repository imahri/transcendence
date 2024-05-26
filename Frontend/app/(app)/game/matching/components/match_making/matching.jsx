import { Linden_Hill } from "next/font/google";
import styles from "./matching.module.css";
import Boardskin from "@/app/(app)/game/matching/components/match_making/board_skin";
import Ready from "@/app/(app)/game/matching/components/match_making/ready";
import Link from "next/link";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import React, { useEffect, useRef, useState, useContext } from "react";
import { UserContext } from "@/app/(app)/context";
import Image from "next/image";

var count;

const Matching = () => {
	// const [socket, setSocket] = useState(null);

	// useEffect(() => {
	// 	const ws = new WebSocket(
	// 		"ws://10.12.5.7:8000/ws/game?" + `token=${getToken()}`,
	// 	);

	// 	ws.onopen = () => {
	// 		console.log("opened");
	// 		setSocket(ws);
	// 	};

	// 	ws.onmessage = (event) => {
	// 		const data = JSON.parse(event.data);
	// 		if (data?.event === "update") {
	// 			print("pass")
	// 		}
	// 		if (data.event == "index_player") {
	// 			console.log(">>>>  ", data.index);
	// 		}
	// 	};

	// 	ws.onerror = () => {
	// 		console.log("error happened");
	// 	};
	// 	ws.onclose = () => {
	// 		console.log("closed");
	// 	};
	// 	return () => {
	// 		ws.close;
	// 	};
	// },[]);

	const { user } = useContext(UserContext);
	// useEffect(() => {
	// 	const first_of_all = () => {
	// 		if (socket && socket.readyState === WebSocket.OPEN) {
	// 			console.log("itis")
	// 			socket.send(JSON.stringify({ event: "users_data", index: count }));
	// 			count++;
	// 		}
	// 	};

	// 	first_of_all();
	// }, []);

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
										src={user.img}
										height={100}
										width={200}
										className={`${styles.player_picture}`}
									/>
								</div>
								<div className={`${styles.username}`}>
									{user.username}
								</div>
								<div className={`${styles.exp}`}>
									{user.info.exp}
									<span> exp</span>
								</div>
							</div>

							<div className={styles.versus}>vs</div>

							<div className={`${styles.first_player}`}>
								<div className={`${styles.player_pic}`}></div>
								<div className={`${styles.username}`}>
									FiddlerX
								</div>
								<div className={`${styles.exp}`}>
									2564789 exp
								</div>
							</div>
						</div>
					</div>

					<div className={`${styles.layer} ${styles.four}`}>
						{/* choice */}
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
					</div>
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
								<Link href="/choice">
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

				<Ready />
			</div>
		</div>
	);
};

export default Matching;
