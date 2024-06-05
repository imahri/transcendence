import Image from "next/image";
import Link from "next/link";
import styles from "./End.module.css";
import { APIs } from "@/Tools/fetch_jwt_client";
import React, { useEffect, useRef, useState, useContext } from "react";
import { UserContext } from "@/app/(app)/context";

const EInter = () => {
	const { user } = useContext(UserContext);
	return (
		<div className="absolute left-0 top-0 size-full flex justify-center items-center backdrop-blur-[5px]">
			<div className={styles.container}>
				<div className={styles.holder}>
					<div className={styles.first_part}>
						<div className={styles.pic}>
							<Image
								src={APIs.image(user.img)}
								height={100}
								width={200}
								className={`${styles.player_picture}`}
								alt="Profile image"
							/>
						</div>
						<span className={styles.result}>END GAME</span>
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

export default EInter;
