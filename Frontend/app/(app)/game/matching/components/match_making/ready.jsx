import styles from "./matching.module.css";

const Ready = ({ className }) => {
	return (
		<div>
			<div className={`${styles.ready}`}>
				<button className={`${styles.btn_ready}`}> Ready!!</button>
			</div>
		</div>
	);
};

export default Ready;
