"use client";

import styles from "./components/card_pic/cardpic.module.css";
import Image from "next/image";
import Fooo from "./components/images/made.svg";
import Cardpic from "@/app/(app)/game/components/card_pic/Cardpic";
import { Provider } from "@/app/(app)/context/Context";
import { useEffect } from "react";

const game = () => {
	// const { socket_, setSocket } = Provider();

	// useEffect(() => {
	// 	setSocket(5000);

	// 	console.log(socket_);
	// }, []);
	return (
		<>
			<Cardpic />
		</>
	);
};

export default game;
