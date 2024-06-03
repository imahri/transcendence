import styles from "./rank.module.css";
import Image from "next/image";
import second_grade from "../images/second.svg";

const Cards_Ranking = ({ username, full_name }) => {
	return (
		<div className={`${styles.box} ${styles.fp}`}>
			<div className={`${styles.pic_holder}`}>
				<div className={`${styles.pic}`}></div>
			</div>

			<div className={`${styles.data}`}>
				<div className={`${styles.data_content1}`}>
					<h1>{username}</h1>
					<span>{full_name}</span>
				</div>
				<div className={`${styles.data_content2}`}>
					<div className={`${styles.set_top}`}>
						<span className={`${styles.title_top}`}>Top</span>
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
	);
};

export default Cards_Ranking;
