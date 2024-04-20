"use client";
import React, { useContext } from "react";

import gameTable from "../assets/game_table.png";
import profileImg from "../assets/profile.png";
import GameState from "./GameState";
import Image from "next/image";
import { UserContext } from "../../context";

const user2 = { score: 5, userName: "chafi9", image: profileImg };

function State({ title, state1, state2 }) {
	return (
		<div className="w-[250px] flex justify-between">
			<h1 className=" font-semibold text-[15px] text-white">{state1}</h1>
			<h1 className=" font-bold text-[15px] text-white">{title}</h1>
			<h1 className=" font-semibold text-[15px] text-white">{state2}</h1>
		</div>
	);
}

function LastGame() {
	const { user, setUser } = useContext(UserContext);

	return (
		<div className=" w-[50%] max-[1990px]:w-[40%] h-[424px] rounded-[15px] flex flex-col items-center justify-center gap-[20px] max-[710px]:w-[90%]">
			<h2 className=" font-bold text-[20px] text-white">Last Game</h2>
			<div>
				<GameState user1={user} user2={user2} />
				<Image className="w-[254px] h-[66px]" src={gameTable} alt="" />
			</div>
			<State title={"Level"} state1={user.info.level} state2={6.4} />
			<State title={"Rank"} state1={"Gold"} state2={"Bronz"} />
			<State title={"Paddle"} state1={"Aubarc"} state2={"Podolica"} />
			<State title={"Player"} state1={user.username} state2={"K-bot"} />
		</div>
	);
}

export default LastGame;
