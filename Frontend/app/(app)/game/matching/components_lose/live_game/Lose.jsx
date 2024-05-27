import Image from "next/image";
import Link from "next/link";
import styles from "./Lose.module.css";

const LInter = () => {
	return (
		<div className="absolute left-0 top-0 size-full flex justify-center items-center backdrop-blur-[5px]">
			<div className={styles.container}>
				<div className={styles.holder}>
					<div className={styles.first_part}>
						<span className={styles.title}>unfortunately</span>
						<div className={styles.pic}></div>
						<span className={styles.state}>You lose</span>
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

export default LInter;
