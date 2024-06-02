import styles from "./rank.module.css";
import Image from "next/image";

import First_Ranking from "./first";
import Second_Ranking from "./second";
import Third_Ranking from "./third";
import Player_rank from "./players_rank";

const Ranking = () => {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				{/* navbar */}
				<div className={`${styles.layer} ${styles.first}`}></div>

				<div className={`${styles.layer} ${styles.title}`}>
					<h1>Ranking</h1>
				</div>

				<div className={`${styles.layer} ${styles.cards}`}>
					<Second_Ranking />
					<First_Ranking />
					<Third_Ranking />
				</div>

				<div className={`${styles.layer} ${styles.rank}`}>
					<table className={styles.table}>
						<thead className={styles.thead}>
							<tr>
								<th className={styles.tco}></th>
								<th className={styles.tco}>Full Name</th>
								<th className={styles.tco}>Lvl</th>
								<th className={styles.tco}>Rank</th>
								<th className={styles.tco}>Exp</th>
								<th className={styles.tco}>Match</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className={styles.tco}></td>
							</tr>
							<Player_rank />
						</tbody>
					</table>
				</div>
				<div className={`${styles.layer} ${styles.last}`}></div>
			</div>
		</div>
	);
};

export default Ranking;
