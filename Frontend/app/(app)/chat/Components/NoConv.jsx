import Image from "next/image";
import styles from "./styles/NoConv.module.css";
import NoConv_icon from "./assets/no_conv.svg";

export function NoConv() {
	return (
		<div className={styles.noConv}>
			<Image
				width={500}
				height={500}
				src={NoConv_icon}
				alt="no conv icon"
			/>
			<p>With great power comes great responsibility</p>
		</div>
	);
}
