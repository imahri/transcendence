"use client";
import Matching from "@/app/(app)/game/matching/components/match_making/matching";
import LGame from "@/app/(app)/game/matching/gcomponents/live_game/Livegame";
import WInter from "@/app/(app)/game/game_local/game_win/live_game/Win";
import LInter from "@/app/(app)/game/game_local/game_lose/live_game/Lose";
import Shit from "@/app/(app)/game/matching/end/End";
import { useSearchParams } from "next/navigation";
import React, { useContext, useState, useEffect } from "react";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import { useRouter } from "next/navigation";
import { UserContext } from "../../context";

async function GetRoom(room_name, is_tournament, mode) {
	const [isOk, status, data] = await fetch_jwt(APIs.game.create_room, {
		room: room_name,
		tournament: is_tournament,
		mode: mode,
	});
	if (!isOk) {
		return false;
	}
	return data;
}

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

const Vim = () => {
	const [loading, setLoading] = useState(true);
	const [checkRoom, setCheckRoom] = useState(true);
	const [win, setWin] = useState(false);
	const [lose, setLose] = useState(false);
	const [end, setEnd] = useState(false);
	const navigate = useRouter();
	const [player1, setPlayer1] = useState();
	const [player2, setPlayer2] = useState();
	const [boardpic, setBoardPic] = useState();
	const [loadImage, setLoadImage] = useState(true);
	const { user } = useContext(UserContext);

	const searchParams = useSearchParams();
	useEffect(() => {
		const room_name = searchParams.get("room");
		if (!room_name) return setCheckRoom(false);
		const CheckRoom = async () => {
			const tournament_name = searchParams.get("tournament");
			const mode = room_name.startsWith("room_private_", 0)
				? "private"
				: tournament_name
					? "tournament"
					: "random";
			const data = await GetRoom(
				room_name,
				tournament_name != null,
				mode,
			);
			if (!data) return navigate.push("/404");
			setCheckRoom(false);
		};
		CheckRoom();
	}, []);

	useEffect(() => {
		if (!boardpic) getBoard(user.username, setBoardPic, setLoadImage);
	}, [boardpic]);

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
	const checkEnd = () => {
		setEnd(true);
	};

	return (
		<div>
			{checkRoom || loadImage ? (
				<div>Loading ...</div>
			) : (
				<>
					<LGame
						checkEnd={checkEnd}
						checkWinner={checkWinner}
						checkLoser={checkLoser}
						secondArrived={secondArrived}
						loading={loading}
						boardpic={boardpic}
						players={{
							player1: player1,
							player2: player2,
							setPlayer1: setPlayer1,
							setPlayer2: setPlayer2,
						}}
					/>
					{loading && (
						<Matching
							player1={player1}
							player2={player2}
							boardpic={boardpic}
						/>
					)}
					{win && <WInter />}
					{lose && <LInter />}
					{end && <Shit />}
				</>
			)}
		</div>
	);
};

export default Vim;
