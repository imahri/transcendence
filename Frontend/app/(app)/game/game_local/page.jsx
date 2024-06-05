"use client";
import LocGame from "@/app/(app)/game/game_local/components/local_game/loco_game";
import LInter from "@/app/(app)/game/game_local/game_lose/live_game/Lose";
import WInter from "@/app/(app)/game/game_local/game_win/live_game/Win";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const GameLocal = () => {
	const [win, setWin] = useState(false);
	const [lose, setLose] = useState(false);

	const checkWinner = () => {
		setWin(true);
	};

	const checkLoser = () => {
		setLose(true);
	};

	return (
		<div>
			<LocGame checkWinner={checkWinner} checkLoser={checkLoser} />

			{win && <WInter />}
			{lose && <LInter />}
		</div>
	);
};

export default GameLocal;
