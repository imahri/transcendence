"use client";
import Image from "next/image";
import LocGame from "@/app/(app)/game_local_fr/components/local_game/loco_game";
import { useState } from "react";

const GameLocal = () => {
	let [count, setCount] = useState(0);

	// function increment =

	count += 10;

	return (
		<div>
			<LocGame />
			{/* <div style={{ color: "white" }}>
				{count}
			</div>
	<button style={{ background: "white" }} onClick={() => setCount(count + 1)}>Increment count</button>*/}
		</div>
	);
};

export default GameLocal;
