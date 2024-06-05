"use client";
import LocGame from "@/app/(app)/game/game_local_fr/components/local_game/loco_game";
import EInter from "@/app/(app)/game/game_local_fr/live_game/End";
import { useState } from "react";

const GameLocal = () => {
	const [end, setEnd] = useState(false);

	const checkEnd = () => {
		setEnd(true);
	};

	return (
		<div>
			<LocGame checkEnd={checkEnd} />
			{end && <EInter />}
		</div>
	);
};

export default GameLocal;
