"use client";
import gameTable from "../assets/game_table.png";
import GameState from "./GameState";
import Image from "next/image";
import Loading from "@/app/(auth)/Loading";
import Link from "next/link";

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

function Info({ title, value }) {
	return (
		<div className="flex items-center justify-between w-[200px]">
			<h2 className="text-[#7D7D7D]">{title}</h2>
			<h2 className="text-[#FFFCFC]">{value}</h2>
		</div>
	);
}

function NoGameYet({ User }) {
	return (
		<div className="w-full h-full flex flex-col items-center gap-[10px]">
			<Image
				className="size-[100px] rounded-full border-2 border-[#FCE155]"
				width={100}
				height={100}
				src={User.img}
				alt="User Image"
			/>
			<h1 className="text-[#7D7D7D] font-bold">
				{User.first_name} {User.last_name}
			</h1>
			<Image className="w-[254px] h-[66px]" src={gameTable} alt="" />
			<Info title={"Level"} value={User.info.level} />
			<Info title={"Match Played"} value={0} />
			<Info title={"Walet"} value={User.info.wallet} />
			<Link
				href={"/game"}
				className="text-[#00FE75] font-normal text-[15px]"
			>
				Start Playing
			</Link>
		</div>
	);
}

function LastGame({ User, lastgame, isLoading }) {
	return (
		<div className="w-[50%] [@media(max-width:1990px)]:w-[40%] h-[424px] rounded-[15px] flex flex-col items-center gap-[20px] [@media(max-width:710px)]:w-[90%]">
			<h2 className=" font-bold text-[20px] text-white  mt-[20px]">
				Last Game
			</h2>
			<div className={`${isLoading ? "" : "hidden"} relative  size-full`}>
				<Loading />
			</div>

			{!lastgame && !isLoading && <NoGameYet User={User} />}
			{lastgame && (
				<>
					<GameState
						user1={User}
						user2={lastgame.enemy}
						score1={lastgame.score}
						score2={lastgame.enemy_match.score}
					/>
					<Image
						className="w-[254px] h-[66px]"
						src={gameTable}
						alt=""
					/>
					<State
						title={"Level"}
						state1={User.info.level}
						state2={lastgame.enemy.info.level}
					/>
					<State
						title={"Energy"}
						state1={User.info.energy}
						state2={lastgame.enemy.info.energy}
					/>
					<State
						title={"Rank"}
						state1={User.info.grade.name}
						state2={lastgame.enemy.info.grade.name}
					/>
					<State
						title={"Player"}
						state1={User.username}
						state2={lastgame.enemy.username}
					/>
				</>
			)}
		</div>
	);
}
export default LastGame;
