import Historic from "@/app/(app)/home/Components/Historic";
import LastGame from "@/app/(app)/home/Components/LastGame";
import { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../page";
import Image from "next/image";
import noTrophy from "../assets/noTrophy.png";
import Trophy from "../assets/Trophy.png";
import refreshSvg from "../assets/refresh.svg";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import { UserContext } from "@/app/(app)/context";

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
							src={APIs.image(info.grade.image)}
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
					<DisplayStatistic title={"total games"} nb={state?.p} />
					<DisplayStatistic title={"winning games"} nb={state?.w} />
					<DisplayStatistic title={"loses games"} nb={state?.l} />
				</div>
				<Circle info={userProfile.info} />
			</div>
		</>
	);
}

function getDetails(id) {
	const instruction = {
		1: "Finish the missons",
		2: "Finish the missons",
		3: "Finish the missons",
		4: "Win 10 match",
		5: "Play against fiddler",
		6: "Win 20 match",
		7: "Win 15 match",
		8: "only staff",
	};
	return instruction[id];
}

async function checkAchievment(setUpdate, setAch) {
	const [isOk, status, data] = await fetch_jwt(APIs.game.check_acheivments);

	if (status == 200) {
		setUpdate(true);
		setAch(true);
	}
}

function ShowRoom({ items, setGetAch }) {
	const [details, setDetails] = useState();
	const { setUpdate } = useContext(UserContext);

	return (
		<div className="w-full flex flex-col items-center gap-[5px] relative">
			<div className="flex items-center justify-between gap-[10px]">
				<h1 className="font-Chakra font-bold text-[#BABABA] text-[20px]">
					Achievment
				</h1>
				<div
					className="cursor-pointer relative group"
					onClick={() => checkAchievment(setUpdate, setGetAch)}
				>
					<Image src={refreshSvg} alt="" />
					<span className="scale-0 group-hover:scale-100 absolute top-[-40px] w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transistion-all duration-100">
						check if you unlocked new acievments
					</span>
				</div>
			</div>
			<div className="flex w-[90%] overflow-x-scroll pb-[10px]">
				{items &&
					items.map((obj, index) => {
						return (
							<Image
								key={index}
								className={`size-[70px] ${obj.unlocked ? "" : "grayscale"} cursor-pointer`}
								width={70}
								height={70}
								src={APIs.image(obj.icon_path)}
								alt="Acheivment"
								onMouseEnter={() =>
									setDetails(getDetails(obj.id))
								}
								onMouseLeave={() => setDetails(false)}
							/>
						);
					})}
			</div>
			<span
				className={`${details ? "scale-100" : ""} absolute top-[-10px] w-auto p-2 m-2 min-w-max  rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transistion-all duration-100 scale-0 origin-bottom`}
			>
				{details}
			</span>
		</div>
	);
}

function Trournament({ nb }) {
	const src = nb ? Trophy : noTrophy;
	return (
		<div className="w-full flex flex-col items-center gap-[5px]">
			<h1 className="font-Chakra font-bold text-[#BABABA] text-[20px]">
				Tournament
			</h1>
			<div className="flex justify-center pb-[10px] relative  cursor-pointer group">
				<Image
					className="size-[70px]"
					width={70}
					height={70}
					src={src}
					alt="Trophy"
				/>
				<div className="scale-0 group-hover:scale-100 transition-all duration-300 rounded-full absolute right-[-10px] top-[-20px] px-[10px] py-[5px] bg-[#2A2A2A] shadow-lg text-white z-10">
					{nb}
				</div>
			</div>
		</div>
	);
}

async function GameHistoric(
	username,
	setLastGame,
	setGmaeHistoric,
	setLoading,
	setState,
) {
	setLoading(true);
	const [isOk, status, data] = await fetch_jwt(APIs.game.matches, {
		username: username,
	});
	if (!isOk) {
		setLoading(false);
		return;
	}
	setLastGame(data.last_match);
	setGmaeHistoric(data.all);
	setState({ w: data.winning, l: data.loses, p: data.played });

	setLoading(false);
}
const getAcheivments = async (setAch, username) => {
	const [isOk, status, data] = await fetch_jwt(APIs.game.acheivments, {
		username: username,
	});
	if (isOk) {
		data?.sort((a, b) => !a.unlocked);
		setAch(data);
		return;
	}
};

export default function MyState() {
	const [ach, setAch] = useState();
	const [getAch, setGetAch] = useState();
	const [state, setState] = useState();
	const [lastGame, setLastGame] = useState();
	const [gameHistoric, setGmaeHistoric] = useState();
	const [isLoading, setLoading] = useState();
	const userProfile = useContext(UserProfileContext);

	useEffect(() => {
		GameHistoric(
			userProfile.username,
			setLastGame,
			setGmaeHistoric,
			setLoading,
			setState,
		);
	}, []);

	useEffect(() => {
		if (!ach || getAch) getAcheivments(setAch, userProfile.username);
	}, [getAch]);

	return (
		<div className="w-[95%] flex justify-center items-center gap-[20px] [@media(max-width:1400px)]:flex-col">
			<div className="h-full pb-[15px] w-[30%] [@media(max-width:1400px)]:w-[95%] bg-[#2F2F2F] rounded-[10px] flex flex-col items-center gap-[20px]">
				<Status state={state} />
				<div className="[@media(max-width:1400px)]:flex [@media(max-width:650px)]:flex-col">
					<ShowRoom items={ach} setGetAch={setGetAch} />
					<Trournament nb={userProfile.info.tournament_win} />
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
