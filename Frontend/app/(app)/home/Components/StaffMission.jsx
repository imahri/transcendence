import React from "react";

import prize1 from "../assets/prize1.png";
import prize2 from "../assets/prize2.png";
import prize3 from "../assets/prize3.png";

import { Mission, GameMission } from "./Mission";

const firstMission = {
	owner: { userName: "Sakawi", fullName: "Oussama Krich" },
	exp: 750,
	prize: { wallet: 350, logo: prize1 },
	bg: "bg-greatBlue",
	title: "User",
};

const secondMission = {
	owner: { userName: "RedMega", fullName: "Redouane Iben Hamou" },
	exp: 800,
	prize: { wallet: 300, logo: prize2 },
	bg: "bg-goto",
	title: "Chat",
};

const thirdMission = {
	owner: { userName: "Fiddler", fullName: "Imad-eddine Mahri" },
	exp: 1110,
	prize: { wallet: 500, logo: prize3 },
	bg: "bg-the_great",
	title: "Game",
};

function StaffMission() {
	return (
		<div className="w-[25%] flex flex-col items-center gap-[10px] [@media(max-width:1500px)]:order-2 [@media(max-width:1500px)]:w-[50%] [@media(max-width:710px)]:w-[90%]">
			<div className="w-[80%] h-[55px] bg-[#353535] rounded-[7px] flex justify-center items-center [@media(max-width:710px)]:w-[100%]">
				<h1 className=" font-bold text-[20px] text-white text-center">
					Staff Mission
				</h1>
			</div>
			<div className="w-[80%] h-[156px] rounded-[7px] flex justify-between gap-[20px] [@media(max-width:710px)]:w-[100%]">
				<Mission mission={firstMission} />
				<Mission mission={secondMission} />
			</div>
			<GameMission mission={thirdMission} />
			<div className="w-[80%] h-[71px] bg-[#4FA1EC] bg-opacity-[61%] rounded-[7px] flex justify-center items-center [@media(max-width:710px)]:w-[100%]">
				<h1 className=" font-bold text-[20px] text-white">Verefied</h1>
			</div>
		</div>
	);
}

export default StaffMission;
