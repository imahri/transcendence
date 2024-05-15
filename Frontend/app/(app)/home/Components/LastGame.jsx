"use client";
import React, { useContext } from "react";

import gameTable from "../assets/game_table.png";
import profileImg from "../assets/profile.png";
import GameState from "./GameState";
import Image from "next/image";
import { UserContext } from "../../context";

const user2 = { score: 5, userName: "chafi99999999999", image: profileImg };

function State({ title, state1, state2 }) {
	return (
		<div className="w-[250px] flex justify-between">
			<h1 className=" font-semibold text-[15px] text-white w-[30%] overflow-hidden truncate text-left">
				{state1}
			</h1>
			<h1 className=" font-bold text-[15px] text-white w-[30%] overflow-hidden truncate text-center">
				{title}
			</h1>
			<h1 className=" font-semibold text-[15px] text-white w-[30%] overflow-hidden truncate text-center">
				{state2}
			</h1>
		</div>
	);
}

function LastGame() {
	const { user, setUser } = useContext(UserContext); //get the user from props and fetch his gamestate

	return (
		<div className="w-[50%] [@media(max-width:1990px)]:w-[40%] h-[424px] rounded-[15px] flex flex-col items-center justify-center gap-[20px] [@media(max-width:710px)]:w-[90%]">
			<h2 className=" font-bold text-[20px] text-white">Last Game</h2>
			<GameState user1={user} user2={user2} />
			<Image className="w-[254px] h-[66px]" src={gameTable} alt="" />
			<State title={"Level"} state1={user.info.level} state2={6.4} />
			<State title={"Rank"} state1={"Gold"} state2={"Bronz"} />
			<State title={"Paddle"} state1={"Aubarc"} state2={"Podolica"} />
			<State
				title={"Player"}
				state1={user.username}
				state2={user2.userName}
			/>
		</div>
	);
}

export default LastGame;
