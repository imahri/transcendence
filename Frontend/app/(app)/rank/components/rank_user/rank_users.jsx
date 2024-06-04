import styles from "./rank.module.css";
import Image from "next/image";

import First_Ranking from "./first";
import Second_Ranking from "./second";
import Third_Ranking from "./third";
import Player_rank from "./players_rank";
import { fetch_jwt } from "@/Tools/fetch_jwt_server";
import { APIs } from "@/Tools/fetch_jwt_client";
import { redirect } from "next/navigation";

async function get_rank() {
	const [isOk, status, data] = await fetch_jwt(APIs.game.rank);
	if (!isOk) redirect("/404");
	return data;
}

const Ranking = async () => {
	const data = await get_rank();

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				{/* navbar */}
				<div className={`${styles.layer} ${styles.first}`}></div>

				<div className={`${styles.layer} ${styles.title}`}>
					<h1>Ranking</h1>
				</div>

				<div className={`${styles.layer} ${styles.cards}`}>
					<Second_Ranking
						username={data[0]?.username}
						full_name={`${data[0]?.first_name} ${data[0]?.last_name}`}
					/>
					<First_Ranking
						username={data[1]?.username}
						full_name={`${data[1]?.first_name} ${data[1]?.last_name}`}
					/>
					<Third_Ranking
						username={data[2]?.username}
						full_name={`${data[2]?.first_name} ${data[2]?.last_name}`}
					/>
				</div>

				<div className={`${styles.layer} ${styles.rank}`}>
					<div className={styles.container_player}>
						<div className={styles.head}>
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
