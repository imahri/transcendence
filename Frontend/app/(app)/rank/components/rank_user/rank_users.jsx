"use client";
import styles from "./rank.module.css";
import First_Ranking from "./first";
import Second_Ranking from "./second";
import Third_Ranking from "./third";
import Player_rank from "./players_rank";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { useEffect, useState } from "react";

async function get_rank() {
	const [isOk, status, data] = await fetch_jwt(APIs.game.rank);
	if (isOk) return data;
	return [];
}

const Ranking = () => {
	const [Loading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	useEffect(() => {
		get_rank().then((data) => {
			setData(data);
			setLoading(false);
		});
	}, []);

	return Loading ? (
		<div className="w-full h-screen bg-[#202020] flex justify-center items-center text-white">
			Loading ....
		</div>
	) : (
		<div className={styles.page}>
			<div className={styles.container}>
				{/* navbar */}
				<div className={`${styles.layer} ${styles.first}`}></div>

				<div className={`${styles.layer} ${styles.title}`}>
					<h1>Ranking</h1>
				</div>

				<div className={`${styles.layer} ${styles.cards}`}>
					<Second_Ranking
						picoProfile={data[1]?.img}
						username={data[1]?.username}
						full_name={`${data[1]?.first_name} ${data[1]?.last_name}`}
					/>

					<First_Ranking
						picoProfile={data[0]?.img}
						username={data[0]?.username}
						full_name={`${data[0]?.first_name} ${data[0]?.last_name}`}
					/>

					<Third_Ranking
						picoProfile={data[2]?.img}
						username={data[2]?.username}
						full_name={`${data[2]?.first_name} ${data[2]?.last_name}`}
					/>
				</div>

				<div className={`${styles.layer} ${styles.rank}`}>
					<div className={styles.container_player}>
						<div className={`${styles.head} ${styles.top_one}`}>
							<div className={styles.pack}>Rank</div>
							<div className={styles.pack}>Full Name</div>
							<div className={styles.pack}>Level</div>
							<div className={styles.pack}>Grade</div>
							<div className={styles.pack}>Exp</div>
						</div>

						{data.map((info, idx) => (
							<Player_rank key={idx} idx={idx} info={info} />
						))}
					</div>
				</div>
				<div className={`${styles.layer} ${styles.last}`}></div>
			</div>
		</div>
	);
};

export default Ranking;
