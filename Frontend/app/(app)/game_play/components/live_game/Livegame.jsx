import styles from "./LGame.module.css";
import Image from "next/image";
import Link from "next/link";
import Aup from "../images/up.svg";
import Ado from "../images/down.svg";
import Son from "../images/sound.svg";
import Soff from "../images/mute.svg";
import Mon from "../images/music.svg";
import Moff from "../images/no_sound.svg";
import { Youchen } from "./game";

const LGame = () => {
	return (
		// <div className={styles.page}>
		// 	<div className={styles.container}>
		// 		<div className={`${styles.layer} ${styles.first}`}></div>
		// 		<div className={`${styles.layer} ${styles.title}`}>
		// 			<h2>Live</h2>
		// 		</div>
		<div>
			<Youchen />
		</div>
		// 	</div>
		// </div>
	);
};

export default LGame;
