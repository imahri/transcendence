"use client";
import { useContext } from "react";

import profileImg from "../assets/profile.png";
import Image from "next/image";
import { UserContext } from "../../context";
import Link from "next/link";

function GameState({ match }) {
	const user1 = match.user1;
	const user2 = match.user2;
	user1.score = 5;

	const win = "bg-[#FFD700]";
	const lose = "bg-red-600";
	const draw = "bg-green-600";

	let result1_color = user1.score > user2.score ? win : lose;
	result1_color = user1.score == user2.score ? draw : result1_color;
	let result2_color = result1_color == win ? lose : win;
	result2_color = result1_color == draw ? draw : result2_color;

	return (
		<div className="flex items-center justify-center gap-[20px] w-[100%]">
			<h2 className=" font-bold text-[15px] text-white w-[90px] overflow-hidden truncate">
				{user1.username}
			</h2>
			<div
				className={` ${result1_color} size-[46px] rounded-full flex justify-center items-center`}
			>
				<Image
					className="size-[95%] rounded-full"
					width={0}
					height={0}
					src={user1.info.profile_img}
					alt=""
				/>
			</div>
			<div className="bg-[#696969] size-[34px] rounded-full flex justify-center items-center">
				<h2 className=" font-bold text-[10px] text-white">
					{user1.score} : {user2.score}
				</h2>
			</div>
			<Link
				href={`/profile/${user2.username}`}
				className={`${result2_color} size-[46px] rounded-full flex justify-center items-center`}
			>
				<Image
					className="size-[95%] rounded-full"
					width={0}
					height={0}
					src={user2.image}
					alt=""
				/>
			</Link>
			<Link href={`/profile/${user2.username}`}>
				<h2 className=" font-bold text-[15px] text-white w-[90px] overflow-hidden truncate">
					{user2.username}
				</h2>
			</Link>
		</div>
	);
}

const fuser = (score, userName) => ({
	score: score,
	username: userName,
	image: profileImg,
});

const match = (one, tow) => ({ user1: one, user2: tow });

function Historic() {
	const { user, setUser } = useContext(UserContext);
	const Matches = [
		match(user, fuser(5, "fiddler")),
		match(user, fuser(6, "fiddler")),
		match(user, fuser(8, "redmega")),
		match(user, fuser(0, "redmega")),
		match(user, fuser(7, "sakawi")),
		match(user, fuser(6, "fiddler")),
		match(user, fuser(8, "redmega")),
		match(user, fuser(0, "redmega")),
		match(user, fuser(7, "sakawi")),
		match(user, fuser(6, "fiddler")),
		match(user, fuser(8, "redmega")),
		match(user, fuser(0, "redmega")),
		match(user, fuser(7, "sakawi")),
		match(user, fuser(6, "fiddler")),
		match(user, fuser(8, "redmega")),
		match(user, fuser(0, "redmega")),
		match(user, fuser(7, "sakawi")),
	];

	return (
		<div className="h-[424px] w-[50%] [@media(max-width:1990px)]:w-[60%] rounded-[15px] flex flex-col items-center gap-[20px] [@media(max-width:710px)]:w-[90%]">
			<h2 className=" font-bold text-[20px] text-white mt-[20px]">
				Historic
			</h2>
			<div className="w-[100%] pt-[10px] mb-[15px] flex flex-col gap-[20px] overflow-y-auto">
				{Matches.map((match, index) => {
					return (
						<div key={index}>
							<GameState match={match} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Historic;
