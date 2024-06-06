import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { Input } from "./CreateTournament";
import Image from "next/image";
import { joinTournament, startTournament } from "./TournamentMethod";
import { APIs } from "@/Tools/fetch_jwt_client";

function UsersDemo({ participant }) {
	return (
		<div className="w-full flex justify-between items-center gap-[10px] h-[50px]">
			<h1 className="font-bold text-[17px] text-[#cccccc]">
				{participant.name}
			</h1>
			<Image
				className="size-[40px] cursor-pointer rounded-full"
				width={40}
				height={40}
				src={APIs.image(participant.user.img)}
				alt="Friend Image"
			/>
		</div>
	);
}

function Button({ text, callBack }) {
	return (
		<button
			className={`${text == "full" ? "cursor-not-allowed" : "cursor-pointer"}  bg-green-500  bg-opacity-70 w-[138px] h-[37px] rounded-[10px]  font-bold text-[16px] text-white relative`}
			onClick={() => callBack()}
		>
			{text}
		</button>
	);
}

function WhatButton(user, Tournament) {
	const full = Tournament.participants.length == 8;
	const IamOwner = Tournament.creator.id == user.id;
	if (Tournament.isEnd) return "Ended";
	if (Tournament.isStarted) return "Started";
	const alreadyIn = Tournament.participants.find(
		(obj) => obj.user.id == user.id,
	)
		? true
		: false;

	if (full && IamOwner) return "Start";
	if (IamOwner) return "Owner";
	else if (full && !alreadyIn) return "Full";
	else if (alreadyIn) return "Already In";
	else if (!full && !alreadyIn) return "Join";
}

export default function Demo({ Tournament, setDemo }) {
	const { user } = useContext(UserContext);
	const users = Tournament.participants;

	const [nickname, setNickName] = useState();
	const [Info, setInfo] = useState();
	const [error, setError] = useState();
	const [button, setButton] = useState(WhatButton(user, Tournament));
	const callBack = {
		Start: () => {
			startTournament(Tournament.id, setError, setButton, setInfo);
		},
		Ended: () => {},
		Owner: () => {},
		Started: () => {},
		Full: () => {},
		"Already In": () => {},
		Join: () => {
			joinTournament(
				Tournament.id,
				user,
				nickname,
				setError,
				setDemo,
				setInfo,
				setButton,
			);
		},
	};

	return (
		<>
			<div className="w-full flex flex-col items-center gap-[15px] py-[10px]">
				<h1 className="text-white text-opacity-40 font-semibold text-[20px]">
					{Tournament.name}
				</h1>
				<div className="w-[80%] h-[250px] flex flex-col gap-[20px] rounded-lg bg-gradient-to-b from-[#343434] via-[rgba(52,52,52,0.398496)] to-[#343434] p-[10px] px-[15px] overflow-y-scroll">
					{users &&
						users.map((obj, index) => {
							return (
								<div key={index}>
									<UsersDemo participant={obj} />
								</div>
							);
						})}
				</div>
				{button == "Join" && (
					<Input
						label={"You can Enter Username"}
						error={error}
						setter={setNickName}
					/>
				)}
				<Button text={button} callBack={callBack[button]} />
			</div>
			<div
				className={`${Info ? "" : "hidden"} w-full h-full absolute backdrop-blur-sm top-0 left-0 flex justify-center items-center`}
			>
				<h1 className="text-white font-semibold text-[14px]">{Info}</h1>
			</div>
			<div
				className={`${error?.error ? "" : "hidden"} w-full h-full absolute backdrop-blur-sm top-0 left-0 flex justify-center items-center`}
			>
				<h1 className="text-white font-semibold text-[14px]">
					Error : {error?.error}
				</h1>
			</div>
		</>
	);
}
