"use client";
import { useState } from "react";
import Image from "next/image";
import Badge from "../../Store/Components/Badge";

import BadgeBack from "/Users/okrich/Desktop/padlees/badge3.png";
import p1 from "/Users/okrich/Desktop/padlees/1.png";
import p2 from "/Users/okrich/Desktop/padlees/2.png";
import p3 from "/Users/okrich/Desktop/padlees/3.png";
import p4 from "/Users/okrich/Desktop/padlees/4.png";
import p5 from "/Users/okrich/Desktop/padlees/5.png";
import p6 from "/Users/okrich/Desktop/padlees/6.png";
import p7 from "/Users/okrich/Desktop/padlees/7.png";

function SkinTitle(active, setActive, title) {
	const color = active ? "text-white" : "text-[#979797]";
	const font = active ? "font-semibold" : "font-normal";
	return (
		<h1
			className={`font-Chakra  ${font} text-[24px] ${color} flex flex-col items-center cursor-pointer`}
			onClick={() => setActive(title)}
		>
			{title}
			{active && <div className="w-[40px] h-[2px] bg-[#DB00FF]"></div>}
		</h1>
	);
}

function Badges({ BadgeInfo }) {
	return (
		<div className="min-w-[263px] w-[263px] h-[165px] relative">
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
		<div className="w-full  bg-[#2B2B2B] rounded-[20px] flex  flex-col gap-[20px]">
			<div className="flex gap-[30px] mt-[30px] ml-[30px]">
				{SkinTitle(active == "Badges", setActive, "Badges")}
				{SkinTitle(active == "Paddles", setActive, "Paddles")}
			</div>

			<div className="w-[80%] h-[226px]   flex gap-[30px] overflow-x-auto mx-[40px] py-[25px]">
				{active == "Badges" &&
					Bbs.map((Bb) => {
						return <Badges BadgeInfo={Bb} />;
					})}
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

//change the methode of rendring S.O.S

export default Skins;
