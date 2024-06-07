import styles from "./style.module.css";
import Link from "next/link";

export const NotFound = () => (
	<div className={styles.all}>
		<div className={styles.box}></div>
		<div className={styles.main}>
			<div className={styles.error_hada}>
				<h1>Oops!</h1>
			</div>
			{/* <div className={styles.loader}></div> */}
			<div className={styles.bar}>
				<div className={styles.ball}></div>
			</div>
		</div>
		<div className={styles.go_home}>
			<Link href={"/home"}>Go to home</Link>
		</div>
		<div className={styles.box}></div>
	</div>
);
