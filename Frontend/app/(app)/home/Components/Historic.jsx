"use client";
import Image from "next/image";
import Link from "next/link";
import Ball from "@/app/(app)/game/matching/components/match_making/ball_it";
import Loading from "@/app/(auth)/Loading";
import { APIs } from "@/Tools/fetch_jwt_client";

function GameState({ User, match }) {
	const user2 = match.enemy;

	const win = "bg-[#FFD700]";
	const lose = "bg-red-600";
	const draw = "bg-green-600";

	let result1_color = match?.score > match.enemy_match?.score ? win : lose;
	result1_color =
		match?.score == match.enemy_match?.score ? draw : result1_color;
	let result2_color = result1_color == win ? lose : win;
	result2_color = result1_color == draw ? draw : result2_color;

	return (
		<div className="flex items-center justify-center gap-[20px] w-[100%]">
			<h2 className=" font-bold text-[15px] text-white w-[90px] sm:w-[60px] xs:w-[60px] overflow-hidden truncate text-right">
				{User.username}
			</h2>
			<div
				className={` ${result1_color} size-[46px] rounded-full flex justify-center items-center`}
			>
				<Image
					className="size-[95%] rounded-full"
					width={0}
					height={0}
					src={APIs.image(User.img)}
					alt="profile image"
				/>
			</div>
			<div className="bg-[#696969] size-[34px] rounded-full flex justify-center items-center">
				<h2 className=" font-bold text-[10px] text-white">
					{match?.score} : {match.enemy_match?.score}
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
					src={APIs.image(user2.img)}
					alt="friend image"
				/>
			</Link>
			<Link href={`/profile/${user2.username}`}>
				<h2 className=" font-bold text-[15px] text-white w-[90px] sm:w-[60px] xs:w-[60px] overflow-hidden truncate">
					{user2.username}
				</h2>
			</Link>
		</div>
	);
}

function EmptyHistoric() {
	return (
		<div className="w-[90%] h-[400px] rounded-[15px] bg-transparent border relative overflow-hidden">
			<div className="size-full flex justify-center items-center">
				<h1 className="text-[30px] text-[#7D7D7D]">Empty History</h1>
			</div>
			<div className="h-20 w-4 bg-[#cb8400] absolute left-[-1px] bottom-[10%] border-[0.5px] animate-leftPadd" />
			<div className="h-20 w-4 bg-[#cb8400] absolute right-[-1px] top-[10%] border-[0.5px] animate-rigthPadd" />
			<Ball />
		</div>
	);
}

function Historic({ User, gameHistoric, isLoading }) {
	return (
		<div className="h-[424px] w-[50%] [@media(max-width:1990px)]:w-[60%] rounded-[15px] flex flex-col items-center gap-[20px] [@media(max-width:710px)]:w-full">
			<h2 className=" font-bold text-[20px] text-white mt-[20px]">
				Historic
			</h2>

			<div className="w-full h-full pt-[10px] mb-[15px] relative flex flex-col items-center gap-[20px] overflow-y-auto">
				{isLoading && <Loading />}
				{!gameHistoric && !isLoading && <EmptyHistoric />}
				{gameHistoric &&
					gameHistoric.map((match, index) => {
						return (
							<div
								className="flex flex-col gap-[10px] justify-center items-center"
								key={index}
							>
								<GameState User={User} match={match} />
								<div
									className={`flex w-[70%] ${index == gameHistoric.length - 1 ? "hidden" : ""}`}
								>
									<div className="w-1/2 h-[2px] bg-gradient-to-l from-white to-transparent"></div>
									<div className="w-1/2 h-[2px] bg-gradient-to-r from-white to-transparent"></div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default Historic;
