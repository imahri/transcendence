import styles from "./loadin.error.module.css";

const Notfound = () => {
	return (
		<div className={styles.all}>
			<div className={styles.box}></div>
			<div className={styles.main}>
				<div className={styles.error_hada}>
					<h1>Page Not found</h1>
				</div>
				{/* <div className={styles.loader}></div> */}
				<div className={styles.bar}>
					<div className={styles.ball}></div>
				</div>
			</div>
			<div className={styles.box}></div>
		</div>
	);
};

export default Notfound;
