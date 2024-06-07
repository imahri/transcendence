import styles from "./style.module.css";

export const Loader = () => (
	<div className={styles.all}>
		<div className={styles.box}></div>
		<div className={styles.main}>
			<div className={styles.loader}></div>
		</div>
		<div className={styles.box}></div>
	</div>
);
