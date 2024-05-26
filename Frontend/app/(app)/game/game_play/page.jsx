"use client";
import { useEffect } from "react";
import Image from "next/image";
import { Provider } from "../../context/Context";

import LGame from "@/app/(app)/game/game_play/components/live_game/Livegame";

const Gamelive = () => {
	return (
		<div>
			<LGame />
		</div>
	);
};

export default Gamelive;
