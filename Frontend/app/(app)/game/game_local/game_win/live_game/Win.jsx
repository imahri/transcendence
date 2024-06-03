import Link from "next/link";
import styles from "./Win.module.css";
import Image from "next/image";
import { IMAGE_URL } from "@/app/URLS";
import React, { useEffect, useRef, useState, useContext } from "react";
import { UserContext } from "@/app/(app)/context";

const WInter = () => {
	let a = "";
	const { user } = useContext(UserContext);

	return (
		<div className="absolute left-0 top-0 size-full flex justify-center items-center backdrop-blur-[5px]">
			<div className={styles.container}>
				<div className={styles.holder}>
					<div className={styles.first_part}>
						<span className={styles.title}>Congratulation</span>
						<div className={styles.pic}>
							<Image
								src={`${IMAGE_URL}?path=${user.img}`}
								height={100}
								width={200}
								className={`${styles.player_picture}`}
							/>
						</div>
						<span className={styles.state}>You Won</span>
						<span className={styles.result}>
							Good luck next time
						</span>
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
