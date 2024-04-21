"use client";
import { useState } from "react";

function SkinTitle(active, setActive, title) {
	const color = active ? "text-white" : "text-[#979797]";
	const font = active ? "font-semibold" : "font-normal";
	return (
		<h1
			className={`font-Chakra  ${font} text-[24px] ${color} flex flex-col items-center cursor-pointer`}
			onClick={() => setActive(title)}
		>
			{title}
			<div
				className={`${!active ? "hidden" : ""} w-[40px] h-[2px] bg-[#DB00FF]`}
			></div>
		</h1>
	);
}

function Dashboard() {
	const [active, setActive] = useState("Game");

	return (
		<div className="w-full h-[700px] mt-[10px]">
			<div className="flex gap-[200px] mt-[30px] ml-[60px]">
				{SkinTitle(active == "Game", setActive, "Game")}
				{SkinTitle(active == "State", setActive, "State")}
				{SkinTitle(active == "Acheivment", setActive, "Acheivment")}
				{SkinTitle(active == "Skins", setActive, "Skins")}
			</div>
		</div>
	);
}

export default Dashboard;
