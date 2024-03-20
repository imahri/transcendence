import React from "react";

import { AboutSvg, WalletSvg, MoreSvg } from "./AllSvg";
import Image from "next/image";

export function Mission({ mission }) {
	const owner = mission.owner;
	const exp = mission.exp;
	const prize = mission.prize;
	const bg = mission.bg;
	const title = mission.title;

	return (
		<div
			className={`w-[45%] h-[100%] ${bg} rounded-[7px] flex flex-col justify-evenly pl-[15px]  max-[1700px]:pl-[10px] relative`}
		>
			<div className="size-[11px] bg-[#4F4F4F] rounded-full absolute top-[10px] right-[10px] flex justify-center items-center">
				{AboutSvg}
			</div>
			<h3 className=" font-bold text-[15px] text-white">{title}</h3>
			<h1 className=" font-bold text-[30px] text-white">
				{exp}{" "}
				<span className=" font-bold text-[14px] text-white">Exp</span>
			</h1>
			<div>
				<h3 className=" font-bold text-[8px] text-[#E6E6E6]">Prize</h3>
				<div className="w-[85px] bg-[#D9D9D9] bg-opacity-[19%] rounded-[2px] flex  items-center justify-center gap-[10px] ml-[10px]">
					<h3 className=" font-bold text-[14px] text-white flex justify-center items-center gap-[5px]">
						{prize.wallet} {WalletSvg}{" "}
					</h3>
					<Image
						className="h-[30px] w-[27px]"
						src={prize.logo}
						alt=""
					/>
				</div>
			</div>
			<div className="w-[95%] h-[30px] flex items-center justify-between">
				<div>
					<h1 className=" font-bold text-[11px] text-white">
						{owner.userName}
					</h1>
					<h2 className=" font-bold text-[9px] text-[#C8C8C8]">
						{owner.fullName}
					</h2>
				</div>
				{MoreSvg}
			</div>
		</div>
	);
}

export function GameMission({ mission }) {
	const owner = mission.owner;
	const exp = mission.exp;
	const prize = mission.prize;
	const bg = mission.bg;
	const title = mission.title;

	return (
		<div
			className={`w-[80%] h-[106px] ${bg} rounded-[7px] flex items-center justify-between relative max-[710px]:w-[100%]`}
		>
			<div className="size-[11px] bg-[#4F4F4F] rounded-full absolute top-[10px] right-[10px] flex justify-center items-center">
				{AboutSvg}
			</div>
			<div className="pl-[20px]">
				<h3 className=" font-bold text-[15px] text-white">{title}</h3>
				<h1 className=" font-bold text-[48px] max-[1706px]:text-[30px] text-white">
					{exp}{" "}
					<span className=" font-bold text-[14px] text-white">
						Exp
					</span>
				</h1>
			</div>
			<div className="w-[50%] flex flex-col gap-[10px]">
				<div>
					<h3 className=" font-bold text-[8px] text-[#E6E6E6]">
						Prize
					</h3>
					<div className="w-[85px] bg-[#D9D9D9] bg-opacity-[19%] rounded-[2px] flex  items-center justify-center gap-[10px] ml-[10px]">
						<h3 className=" font-bold text-[14px] text-white flex justify-center items-center gap-[5px]">
							{prize.wallet} {WalletSvg}{" "}
						</h3>
						<Image
							className="h-[30px] w-[27px]"
							src={prize.logo}
							alt=""
						/>
					</div>
				</div>
				<div className="w-[95%] h-[30px] flex items-center justify-between">
					<div>
						<h1 className=" font-bold text-[11px] text-white">
							{owner.userName}
						</h1>
						<h2 className=" font-bold text-[9px] text-[#C8C8C8]">
							{owner.fullName}
						</h2>
					</div>
					{MoreSvg}
				</div>
			</div>
		</div>
	);
}
