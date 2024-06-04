"use client";
import Matching from "@/app/(app)/game/matching/components/match_making/matching";
import LGame from "@/app/(app)/game/matching/gcomponents/live_game/Livegame";
// import WInter from "@/app/(app)/game/matching/components_win/live_game/Win";
import WInter from "@/app/(app)/game/game_local/game_win/live_game/Win";
// import LInter from "@/app/(app)/game/matching/components_lose/live_game/Lose";
import LInter from "@/app/(app)/game/game_local/game_lose/live_game/Lose";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import { useRouter } from "next/navigation";

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

const Vim = () => {
	const [loading, setLoading] = useState(true);
	const [checkRoom, setCheckRoom] = useState(true);
	const [RoomName, setRoomName] = useState(false);
	const [win, setWin] = useState(false);
	const [lose, setLose] = useState(false);
	const navigate = useRouter();

	//check query param if it's none normal  else check if room exist && send it to connect socket
	const searchParams = useSearchParams();
	useEffect(() => {
		const room_name = searchParams.get("room");
		if (!room_name) return setCheckRoom(false);
		const CheckRoom = async () => {
			const tournament_name = searchParams.get("tournament");
			const data = await GetRoom(room_name, tournament_name != "");
			console.log(data);
			// if (!data) return navigate.push("/404"); //hardcoded for now
			if (!data) return; //hardcoded for now
			setRoomName(room_name);
			setCheckRoom(false);
		};
		CheckRoom();
	}, []);

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
			{checkRoom ? (
				<div>Loading ...</div>
			) : (
				<>
					<LGame
						checkWinner={checkWinner}
						checkLoser={checkLoser}
						secondArrived={secondArrived}
						loading={loading}
					/>
					{loading && <Matching />}
					{win && <WInter />}
					{lose && <LInter />}
				</>
			)}
		</div>
	);
};

export default Vim;
