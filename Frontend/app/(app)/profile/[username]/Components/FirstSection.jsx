"use client";
import { useContext } from "react";
import Image from "next/image";
import Friends from "./Friends";
import starpng from "../../Home/assets/starpng.png";
import { UserContext } from "@/app/(app)/context";

function ShowBox(title, nb) {
	return (
		<div className="bg-[#353535] w-[40%] h-[134px] rounded-[12px] flex flex-col justify-center items-center">
			<h1 className="font-bold text-white text-[32px]">{title}</h1>
			<h3 className="font-medium text-white text-[48px]">{nb}</h3>
		</div>
	);
}

function BigBox({ user }) {
	const levelPercent =
		(user.info.level - Math.floor(user.info.level)) * 100 + "%";
	const levelStyle = {
		background: `conic-gradient(from 0deg, #AD00FF 0% ${levelPercent}, transparent ${levelPercent}, transparent 100%)`,
	};

	return (
		<div className="bg-[#353535] w-full h-[346px] rounded-[31px] flex flex-col items-center justify-center">
			<h1 className="font-bold text-[#BABABA] text-[36px]">Win</h1>
			<div className="size-[244px] ">
				<div
					style={levelStyle}
					className="size-[90%] rounded-full flex justify-center items-center"
				>
					<div className="size-[90%] rounded-full flex flex-col justify-center items-center bg-[#353535]">
						<h1 className="font-bold text-[48px] text-white">
							{user.info.level}
						</h1>
						<Image className="size-[54px]" src={starpng} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}

function FirstSection() {
	const { user } = useContext(UserContext);

	return (
		<div className="w-[15%] h-full  flex flex-col gap-[20px]">
			<Friends />
			<div className="w-full  flex justify-between">
				{ShowBox("Friends", 5)}
				{ShowBox("Groups", 3)}
			</div>

			<BigBox user={user} />
		</div>
	);
}

export default FirstSection;
