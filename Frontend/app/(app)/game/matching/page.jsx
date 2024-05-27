"use client";
import Image from "next/image";
import Matching from "@/app/(app)/game/matching/components/match_making/matching";
import LGame from "@/app/(app)/game/matching/gcomponents/live_game/Livegame";
import WInter from "@/app/(app)/game/matching/components_win/live_game/Win";
import LInter from "@/app/(app)/game/matching/components_lose/live_game/Lose";
import { Provider } from "@/app/(app)/context/Context";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";

const Vim = () => {
	const [loading, setLoading] = useState(true);
	const [win, setWin] = useState(false);
	const [lose, setLose] = useState(false);

	const secondArrived = () => {
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	const checkWinner = () => {
		setWin(true);
	};

	const checkLoser = () => {
		setLose(true);
	};

	return (
		<div>
			{
				<LGame
					checkWinner={checkWinner}
					checkLoser={checkLoser}
					secondArrived={secondArrived}
					loading={loading}
				/>
			}
			{loading && <Matching />}
			{win && <WInter />}
			{lose && <LInter />}
		</div>
	);
};

export default Vim;
