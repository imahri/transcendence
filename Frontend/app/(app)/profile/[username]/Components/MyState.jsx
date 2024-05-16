import Historic from "@/app/(app)/home/Components/Historic";
import LastGame from "@/app/(app)/home/Components/LastGame";
import { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../page";
import Image from "next/image";
import starpng from "@/app/(app)/home/assets/starpng.png";

function DisplayStatistic({ title, nb }) {
	return (
		<div className="min-w-[160px] flex gap-[10px] justify-between">
			<h1 className="text-white font-bold items-start">{title}</h1>
			<h1 className="text-white font-bold">{nb}</h1>
		</div>
	);
}

function Circle({ info }) {
	let level = info.level;
	let levelPercent = (level - Math.floor(level)) * 100 + "%";
	if (levelPercent == "0%") {
		levelPercent = "1.5%";
		level = level + ".0";
	}
	const levelStyle = {
		background: `conic-gradient(from 0deg, #79DDD7 0% ${levelPercent}, transparent ${levelPercent}, transparent 100%)`,
		borderRadius: "50%",
	};
	return (
		<div className="w-1/2 [@media(max-width:650px)]:w-full flex justify-center">
			<div className="size-[150px] rounded-full opacity-[0.75] flex justify-center items-center bg-gradient-to-r from-red-500 to-indigo-700">
				<div
					style={levelStyle}
					className="size-[90%] flex justify-center items-center"
				>
					<div className="size-[90%] rounded-full flex flex-col justify-center items-center bg-gradient-to-r from-red-500 to-indigo-700">
						<h1 className="font-bold text-[30px] text-white">
							{level}
						</h1>
						<Image
							src={info.grade.image}
							width={60}
							height={60}
							alt="Grade"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function Status({ state }) {
	const userProfile = useContext(UserProfileContext);

	return (
		<>
			<div className="flex justify-center items-center gap-[20px] py-[20px]">
				<h1 className="text-white font-bold">Grade :</h1>
				<span className="text-white font-bold text-opacity-[70%]">
					{userProfile.info.grade.name}
				</span>
			</div>
			<div className="flex w-full [@media(max-width:1400px)]:w-[70%] [@media(max-width:650px)]:flex-col [@media(max-width:650px)]:gap-[10px]">
				<div className="w-1/2 [@media(max-width:650px)]:w-full flex flex-col justify-center  items-center gap-[10px] [@media(max-width:650px)]:order-1">
					<DisplayStatistic title={"total games"} nb={state.t} />
					<DisplayStatistic title={"winning games"} nb={state.w} />
					<DisplayStatistic title={"loses games"} nb={state.l} />
				</div>
				<Circle info={userProfile.info} />
			</div>
		</>
	);
}

import t from "../assets/noTrophy.png";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { ACHEIVMENTS_URL } from "@/app/URLS";
import { GameHistoric } from "@/app/(app)/home/Components/Dashboard";

function ShowRoom({ title, items }) {
	return (
		<div className="w-full flex flex-col items-center gap-[5px]">
			<h1 className="font-Chakra font-bold text-[#BABABA] text-[20px]">
				{title}
			</h1>
			<div
				className={`flex ${title == "Trophy" ? "justify-center" : ""}  w-[90%] overflow-x-scroll pb-[10px]`}
			>
				{items &&
					items.map((obj, index) => {
						return (
							<Image
								key={index}
								className={`size-[70px] ${obj.unlocked ? "" : "grayscale"}`}
								width={70}
								height={70}
								src={
									title == "Acheivment" ? obj.icon_path : obj
								}
								alt={title}
							/>
						);
					})}
			</div>
		</div>
	);
}

export default function MyState() {
	const state = { w: 120, l: 4, t: 16 };
	const Trophy = [t];

	const [ach, setAch] = useState();
	const [lastGame, setLastGame] = useState();
	const [gameHistoric, setGmaeHistoric] = useState();
	const [isLoading, setLoading] = useState();
	const userProfile = useContext(UserProfileContext);

	useEffect(() => {
		const getAcheivments = async (setAch) => {
			try {
				const [isOk, status, data] = await fetch_jwt(ACHEIVMENTS_URL);
				if (isOk) {
					data.sort((a, b) => !a.unlocked);
					setAch(data);
					return;
				}
				console.log(data);
			} catch (error) {
				console.log("get acheivment : ", error);
			}
		};
		getAcheivments(setAch);
		GameHistoric(
			userProfile.username,
			setLastGame,
			setGmaeHistoric,
			setLoading,
		);
	}, []);

	return (
		<div className="w-[95%] flex justify-center items-center gap-[20px] [@media(max-width:1400px)]:flex-col">
			<div className="h-full pb-[15px] w-[30%] [@media(max-width:1400px)]:w-[95%] bg-[#2F2F2F] rounded-[10px] flex flex-col items-center gap-[20px]">
				<Status state={state} />
				<div className="[@media(max-width:1400px)]:flex [@media(max-width:650px)]:flex-col">
					<ShowRoom items={ach} title={"Acheivment"} />
					<ShowRoom items={Trophy} title={"Trophy"} />
				</div>
			</div>
			<div className="h-full w-[70%] [@media(max-width:1400px)]:w-[95%] rounded-[10px] bg-[#2F2F2F] flex justify-center items-center [@media(max-width:900px)]:flex-col">
				<LastGame
					User={userProfile}
					lastgame={lastGame}
					isLoading={isLoading}
				/>
				<Historic
					User={userProfile}
					gameHistoric={gameHistoric}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
