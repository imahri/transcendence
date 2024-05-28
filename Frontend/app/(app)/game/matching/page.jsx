"use client";
import Matching from "@/app/(app)/game/matching/components/match_making/matching";
import LGame from "@/app/(app)/game/matching/gcomponents/live_game/Livegame";
import WInter from "@/app/(app)/game/matching/components_win/live_game/Win";
import LInter from "@/app/(app)/game/matching/components_lose/live_game/Lose";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { CREATEROOM_URL } from "@/app/URLS";
import { useRouter } from "next/navigation";

async function GetRoom(room_name) {
	const [isOk, status, data] = await fetch_jwt(CREATEROOM_URL, {
		room: room_name,
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
			const data = await GetRoom(room_name);
			console.log(data);
			if (!data) return navigate.push("/404"); //hardcoded for now
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
						room_name={RoomName}
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
