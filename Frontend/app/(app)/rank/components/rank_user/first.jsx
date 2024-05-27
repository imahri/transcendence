import styles from "./rank.module.css";
import Image from "next/image";
import first_grade from "../images/first.svg";

const Cards_Ranking = () => {
	return (
		<div className={`${styles.box} ${styles.middle} ${styles.fp}`}>
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
						<span className={`${styles.title_top}`}>Top</span>
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
	);
};

export default Cards_Ranking;
