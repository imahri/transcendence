import styles from "./rank.module.css";
import Image from "next/image";
import first_grade from "../images/first.svg";
import second_grade from "../images/second.svg";
import third_grade from "../images/third.svg";

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
					<div className={`${styles.box} ${styles.fp}`}>
						<div className={`${styles.pic_holder}`}>
							<div className={`${styles.pic}`}></div>
						</div>

						<div className={`${styles.data}`}>
							<div className={`${styles.data_content1}`}>
								<h1>FiddlerX</h1>
								<span>Mahri Imad-Eddine</span>
							</div>
							<div className={`${styles.data_content2}`}>
								<div className={`${styles.set_top}`}>
									<span className={`${styles.title_top}`}>
										Top
									</span>
									<div className={`${styles.patron}`}>
										<Image
											width={300}
											height={300}
											src={second_grade}
											alt="no conv icon"
											className={`${styles.pico_pico}`}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`${styles.box} ${styles.fp}`}>
						<div className={`${styles.pic_holder}`}>
							<div className={`${styles.pic}`}></div>
						</div>

						<div className={`${styles.data}`}>
							<div className={`${styles.data_content1}`}>
								<h1>FiddlerX</h1>
								<span>Mahri Imad-Eddine</span>
							</div>
							<div className={`${styles.data_content2}`}>
								<div className={`${styles.set_top}`}>
									<span className={`${styles.title_top}`}>
										Top
									</span>
									<div className={`${styles.patron}`}>
										<Image
											width={300}
											height={300}
											src={first_grade}
											alt="no conv icon"
											className={`${styles.pico_pico}`}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`${styles.box} ${styles.fp}`}>
						<div className={`${styles.pic_holder}`}>
							<div className={`${styles.pic}`}></div>
						</div>

						<div className={`${styles.data}`}>
							<div className={`${styles.data_content1}`}>
								<h1>FiddlerX</h1>
								<span>Mahri Imad-Eddine</span>
							</div>
							<div className={`${styles.data_content2}`}>
								<div className={`${styles.set_top}`}>
									<span className={`${styles.title_top}`}>
										Top
									</span>
									<div className={`${styles.patron}`}>
										<Image
											width={300}
											height={300}
											src={third_grade}
											alt="no conv icon"
											className={`${styles.pico_pico}`}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={`${styles.layer} ${styles.rank}`}></div>
				<div className={`${styles.layer} ${styles.last}`}></div>
			</div>
		</div>
	);
};

export default Ranking;
