import styles from "./LGame.module.css";
import { Gameson } from "./game";
import Res from "./res";
import { useState } from "react";

const LGame = ({
	secondArrived,
	loading,
	checkWinner,
	checkLoser,
	players,
	boardpic,
}) => {
	const [Score, setScore] = useState({ score1: 0, score2: 0 });

	return (
		<div className={`${styles.page} ${loading ? "hidden" : "block"}`}>
			<div className={styles.container}>
				<div className={`${styles.layer} ${styles.first}`}></div>
				<div className={`${styles.layer} ${styles.title}`}>
					<h2>Live</h2>
				</div>
				<div className={`${styles.layer} ${styles.second}`}>
					<div className={styles.all_in}>
						<div className={styles.bord_part}>
							<div className={styles.borad}>
								<Gameson
									setScore={setScore}
									checkWinner={checkWinner}
									checkLoser={checkLoser}
									secondArrived={secondArrived}
									setPlayer1={players.setPlayer1}
									setPlayer2={players.setPlayer2}
									boardpic={boardpic}
								/>
							</div>
							{players.player1 && players.player2 && (
								<Res
									score={Score}
									player1={players.player1}
									player2={players.player2}
								/>
							)}
						</div>
					</div>
				</div>
				<div className={`${styles.layer} ${styles.third}`}></div>
			</div>
		</div>
	);
};

export default LGame;
