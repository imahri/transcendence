"use client";
import Matching from "@/app/(app)/game/matching/components/match_making/matching";
import LGame from "@/app/(app)/game/matching/gcomponents/live_game/Livegame";
import WInter from "@/app/(app)/game/game_local/game_win/live_game/Win";
import LInter from "@/app/(app)/game/game_local/game_lose/live_game/Lose";
import { useSearchParams } from "next/navigation";
import React, { useContext, useState, useEffect } from "react";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import { useRouter } from "next/navigation";
import { UserContext } from "../../context";

async function GetRoom(room_name, is_tournament) {
	const [isOk, status, data] = await fetch_jwt(APIs.game.create_room, {
		room: room_name,
		tournament: is_tournament,
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
	const navigate = useRouter();
	const [player1, setPlayer1] = useState();
	const [player2, setPlayer2] = useState();
	const [boardpic, setBoardPic] = useState();
	const [loadImage, setLoadImage] = useState(true);
	const { user } = useContext(UserContext);

	//check query param if it's none normal  else check if room exist && send it to connect socket
	const searchParams = useSearchParams();
	useEffect(() => {
		const room_name = searchParams.get("room");
		if (!room_name) return setCheckRoom(false);
		const CheckRoom = async () => {
			const tournament_name = searchParams.get("tournament");
			const data = await GetRoom(room_name, tournament_name != "");
			console.log(data);
			if (!data) return navigate.push("/404"); //hardcoded for now
			// if (!data) return; //hardcoded for now
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

	return (
		<div>
			{/* <LGame /> */}
			{checkRoom || loadImage ? (
				<div>Loading ...</div>
			) : (
				<>
					<LGame
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
				</>
			)}
		</div>
	);
};

export default Vim;
