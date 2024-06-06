import Link from "next/link";
import styles from "./Win.module.css";
import Image from "next/image";
import { APIs } from "@/Tools/fetch_jwt_client";
import React, { useContext } from "react";
import { UserContext } from "@/app/(app)/context";

const WInter = () => {
	let a = "";

	const { user } = useContext(UserContext);

	function getRandomInteger(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	let randomInteger = getRandomInteger(1, 100);

	if (randomInteger > 0 && randomInteger < 25) {
		a = "boooyah";
	} else if (randomInteger > 25 && randomInteger < 50) {
		a = "WOOOOOOOOOOOOW";
	} else if (randomInteger > 50 && randomInteger < 75) {
		a = "Vamooooos";
	} else {
		a = "Goat";
	}

	return (
		<div className="absolute left-0 top-0 size-full flex justify-center items-center backdrop-blur-[5px]">
			<div className={styles.container}>
				<div className={styles.holder}>
					<div className={styles.first_part}>
						<span className={styles.title}>Congratulation</span>
						<div className={styles.pic}>
							<Image
								src={APIs.image(user.img)}
								height={100}
								width={200}
								className={`${styles.player_picture}`}
								alt="Profile image"
							/>
						</div>
						<span className={styles.state}>You Won</span>
						<span className={styles.result}>{a}</span>
					</div>
					<div className={styles.second_part}>
						<Link href="/home">
							<button className={styles.btbt}> Back</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WInter;
