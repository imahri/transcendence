"use client";
import LocGame from "@/app/(app)/game/game_local_fr/components/local_game/loco_game";
import EInter from "@/app/(app)/game/game_local_fr/live_game/End";
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "@/app/(app)/context";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";

async function getBoard(username, setBoards, setLoadImage) {
	const [isOk, status, data] = await fetch_jwt(APIs.game.curren_item, {
		username: username,
		type: "boards",
	});

	if (isOk) {
		setBoards(data.image_path);
		setLoadImage(false);
	}
}

const GameLocal = () => {
	const [end, setEnd] = useState(false);
	const [boardpic, setBoardPic] = useState();
	const [loadImage, setLoadImage] = useState(true);
	const { user } = useContext(UserContext);

	const checkEnd = () => {
		setEnd(true);
	};

	useEffect(() => {
		if (!boardpic) getBoard(user.username, setBoardPic, setLoadImage);
	}, [boardpic]);

	return (
		<div>
			{loadImage ? (
				<div>Loading ...</div>
			) : (
				<>
					<LocGame checkEnd={checkEnd} boardpic={boardpic} />
					{end && <EInter />}
				</>
			)}
		</div>
	);
};

export default GameLocal;
