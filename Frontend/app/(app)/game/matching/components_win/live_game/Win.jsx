import Link from "next/link";
import styles from "./Win.module.css";

const WInter = () => {
	return (
		<div className="absolute left-0 top-0 size-full flex justify-center items-center backdrop-blur-[5px]">
			<div className={styles.container}>
				<div className={styles.holder}>
					<div className={styles.first_part}>
						<span className={styles.title}>Congratulation</span>
						<div className={styles.pic}></div>
						<span className={styles.state}>You Won</span>
						<span className={styles.result}>message</span>
					</div>
					<div className={styles.second_part}>
						<Link href="/home">
							<button className={styles.btbt}> Back</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WInter;
