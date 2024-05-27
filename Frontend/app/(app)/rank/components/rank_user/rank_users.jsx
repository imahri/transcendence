import styles from "./rank.module.css";
import Image from "next/image";

import First_Ranking from "./first";
import Second_Ranking from "./second";
import Third_Ranking from "./third";

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

				<div className={`${styles.layer} ${styles.rank}`}></div>
				<div className={`${styles.layer} ${styles.last}`}></div>
			</div>
		</div>
	);
};

export default Ranking;
