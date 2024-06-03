import styles from "./random.module.css";
import Image from "next/image";
import p1 from "../images/aizen.jpeg";
import p2 from "../images/bachira.jpeg";
import p3 from "../images/ichigo.jpeg";
import p4 from "../images/jack.png";
import p5 from "../images/nuffyy.jpeg";
import p6 from "../images/obito.jpeg";
import p7 from "../images/taech.jpeg";
import p8 from "../images/vin.jpeg";

const Random = () => {
	return (
		<div>
			<Image
				src={p1}
				height={100}
				width={200}
				className={`${styles.im} ${styles.m1}`}
			/>
			<Image
				src={p2}
				height={100}
				width={200}
				className={`${styles.im} ${styles.m2}`}
			/>
			<Image
				src={p3}
				height={100}
				width={200}
				className={`${styles.im} ${styles.m3}`}
			/>
			<Image
				src={p4}
				height={100}
				width={200}
				className={`${styles.im} ${styles.m4}`}
			/>
			<Image
				src={p5}
				height={100}
				width={200}
				className={`${styles.im} ${styles.m5}`}
			/>
			<Image
				src={p7}
				height={100}
				width={200}
				className={`${styles.im} ${styles.m7}`}
			/>
			<Image
				src={p8}
				height={100}
				width={200}
				className={`${styles.im} ${styles.m8}`}
			/>
			<Image
				src={p1}
				height={100}
				width={200}
				className={`${styles.im} ${styles.m1}`}
			/>
		</div>
	);
};

export default Random;
