"use client";
import { useState } from "react";
import Image from "next/image";
import Badge from "../../Store/Components/Badge";

import BadgeBack from "../assets/Grade.png";
import p1 from "../assets/Grade.png";
import p2 from "../assets/Grade.png";
import p3 from "../assets/Grade.png";
import p4 from "../assets/Grade.png";
import p5 from "../assets/Grade.png";
import p6 from "../assets/Grade.png";
import p7 from "../assets/Grade.png";

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

function Badges({ BadgeInfo }) {
	return (
		<div className="w-[263px] h-[165px] relative">
			<Badge BadgeInfo={BadgeInfo} />
		</div>
	);
}

const Bb = {
	image: BadgeBack,
	color: "#B23D18",
};

const Bbs = [Bb, Bb, Bb, Bb, Bb, Bb, Bb, Bb];

const Pps = [p1, p2, p3, p4, p5, p6, p7, p1, p2, p3, p4, p5, p6, p7];

function Skins({ user }) {
	Bb.user = user;

	const [active, setActive] = useState("Badges");

	return (
		<div className="w-full h-[350px]  bg-[#2B2B2B] rounded-[20px] flex  flex-col justify-center gap-[20px]">
			<div className="flex gap-[30px] mt-[30px] ml-[30px]">
				{SkinTitle(active == "Badges", setActive, "Badges")}
				{SkinTitle(active == "Paddles", setActive, "Paddles")}
			</div>

			{/* <div className="w-[1550px] max-[2314px]:ml-[20px] max-[2314px]:w-[1200px]  max-[1710px]:w-[1100px] max-[1590px]:w-[900px] max-[1330px]:w-[800px]h-[226px] flex items-center gap-[130px] overflow-x-auto ml-[100px]"> */}
			{/* <div className=" max-w-[90%] bg-red-600 h-[226px] space-x-20 flex items-center overflow-x-auto ml-[100px]"> */}
			<div className=" w-[80%] h-[226px] flex items-center gap-[130px] overflow-x-auto ml-[100px]">
				{/* {active == "Badges" &&
					Bbs.map((Bb) => {

						return  <div><Badges BadgeInfo={Bb} /></div>;
					})} */}
				{active == "Paddles" &&
					Pps.map((Pp) => {
						return (
							<Image
								className="size-[131px] rounded-[10px]"
								src={Pp}
								alt=""
							/>
						);
					})}
			</div>
		</div>
	);
}

export default Skins;
