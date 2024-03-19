import React from "react";

//I need user score

function GameState({ user1, user2 }) {
	const win = "bg-[#FFD700]";
	const lose = "bg-red-600";
	const draw = "bg-green-600";

	let result1_color = user1.score > user2.score ? win : lose;
	result1_color = user1.score == user2.score ? draw : result1_color;
	let result2_color = result1_color == win ? lose : win;
	result2_color = result1_color == draw ? draw : result2_color;

	return (
		<div className="flex items-center justify-between  w-[200px] ml-[30px]">
			<div className="flex flex-col items-center justify-center gap-[10px]">
				<div
					className={` ${result1_color} size-[46px] rounded-full flex justify-center items-center`}
				>
					<img
						className="size-[95%] rounded-full"
						src={user1.info.profile_img}
						alt=""
					/>
				</div>
				<h2 className="font-ChakraBold text-[10px] text-white">
					{user1.userName}
				</h2>
			</div>
			<div className="bg-[#696969] size-[34px] rounded-full flex justify-center items-center">
				<h2 className="font-ChakraBold text-[10px] text-white">
					{" "}
					{5} : {user2.score}{" "}
				</h2>
			</div>
			<div className="flex flex-col items-center justify-center gap-[10px]">
				<div
					className={`${result2_color} size-[46px] rounded-full flex justify-center items-center`}
				>
					<img
						className="size-[95%] rounded-full"
						src={user2.image}
						alt=""
					/>
				</div>
				<h2 className="font-ChakraBold text-[10px] text-white">
					{user2.userName}
				</h2>
			</div>
		</div>
	);
}

export default GameState;
