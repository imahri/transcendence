import Historic from "@/app/(app)/home/Components/Historic";
import LastGame from "@/app/(app)/home/Components/LastGame";
import { useContext } from "react";
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

function Status({ state }) {
	const userProfile = useContext(UserProfileContext);

	const levelPercent =
		(userProfile.info.level - Math.floor(userProfile.info.level)) * 100 +
		"%";
	const levelStyle = {
		background: `conic-gradient(from 0deg, #AD00FF 0% ${levelPercent}, transparent ${levelPercent}, transparent 100%)`,
	};

	return (
		<>
			<div className="flex justify-center items-center gap-[20px] py-[20px]">
				<h1 className="text-white font-bold">Status</h1>
				<span className="text-white font-bold text-opacity-[70%]">
					{state.s}
				</span>
			</div>
			<div className="flex w-full [@media(max-width:1400px)]:w-[70%] [@media(max-width:650px)]:flex-col [@media(max-width:650px)]:gap-[10px]">
				<div className="w-1/2 [@media(max-width:650px)]:w-full flex flex-col justify-center  items-center gap-[10px] [@media(max-width:650px)]:order-1">
					<DisplayStatistic title={"total games"} nb={state.t} />
					<DisplayStatistic title={"winning games"} nb={state.w} />
					<DisplayStatistic title={"loses games"} nb={state.l} />
				</div>
				<div className="w-1/2 [@media(max-width:650px)]:w-full flex justify-center">
					<div
						style={levelStyle}
						className="size-[150px] rounded-full flex justify-center items-center"
					>
						<div className="size-[90%] rounded-full flex flex-col justify-center items-center bg-[#2F2F2F]">
							<h1 className="font-Chakra font-bold text-[25px] text-white">
								{userProfile.info.level}
							</h1>
							<Image
								className="size-[36px]"
								src={starpng}
								alt="Grade"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

import a1 from "../assets/ach1.png";
import a2 from "../assets/ach2.png";
import a3 from "../assets/ach3.png";
import t from "../assets/noTrophy.png";
function ShowRoom({ title, items }) {
	return (
		<div className="w-full flex flex-col items-center gap-[5px]">
			<h1 className="font-Chakra font-bold text-[#BABABA] text-[20px]">
				{title}
			</h1>
			<div className="flex justify-center w-[90%] overflow-x-scroll pb-[10px]">
				{items.map((obj, index) => {
					return (
						<Image
							key={index}
							className="size-[70px]"
							width={70}
							height={70}
							src={obj}
							alt="ach"
						/>
					);
				})}
			</div>
		</div>
	);
}

export default function MyState() {
	const state = { w: 120, l: 4, t: 16, s: "advanced" };
	const achs = [a1, a2, a3];
	const Trophy = [t];

	return (
		<div className="w-[95%] flex justify-center items-center gap-[20px] [@media(max-width:1400px)]:flex-col">
			<div className="h-full pb-[15px] w-[30%] [@media(max-width:1400px)]:w-[95%] bg-[#2F2F2F] rounded-[10px] flex flex-col items-center gap-[20px]">
				<Status state={state} />
				<ShowRoom items={achs} title={"Acheivment"} />
				<ShowRoom items={Trophy} title={"Trophy"} />
			</div>
			<div className="h-full w-[70%] [@media(max-width:1400px)]:w-[95%] rounded-[10px] bg-[#2F2F2F] flex justify-center items-center [@media(max-width:900px)]:flex-col">
				<LastGame />
				<Historic />
			</div>
		</div>
	);
}
