import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { Input } from "./CreateTournament";
import Image from "next/image";
import { joinTournament } from "./TournamentMethod";

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
				src={participant.user.img}
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
	const alreadyIn = Tournament.participants.find(
		(obj) => obj.user.id == user.id,
	)
		? true
		: false;

	if (full && IamOwner) return "Start";
	if (!full && IamOwner) return "Owner";
	else if (full && !alreadyIn) return "Full";
	else if (full && alreadyIn) return "Quit";
	else if (!full && !alreadyIn) return "Join";
}

export default function Demo({ Tournament, setDemo }) {
	const { user } = useContext(UserContext);
	const users = Tournament.participants;

	const [nickname, setNickName] = useState();
	const [error, setError] = useState();
	const button = WhatButton(user, Tournament);

	const callBack = {
		Start: () => {
			console.log("start");
		},
		Owner: () => {
			console.log("owner");
		},
		Full: () => {
			console.log("full");
		},
		Quit: () => {
			console.log("quit");
		},
		Join: () => {
			joinTournament(Tournament.id, user, nickname, setError, setDemo);
		},
	};

	return (
		<div className="w-full flex flex-col items-center gap-[10px]">
			<h1 className="text-white text-opacity-40 font-semibold text-[20px]">
				{Tournament.name}
			</h1>
			<div className="w-[80%] h-[250px] flex flex-col gap-[20px] rounded-lg bg-gradient-to-b from-[#343434] via-[rgba(52,52,52,0.398496)] to-[#343434] p-[10px] overflow-y-scroll">
				{users &&
					users.map((obj, index) => {
						return (
							<div key={index}>
								<UsersDemo participant={obj} />
							</div>
						);
					})}
			</div>
			{button != "Join" && (
				<Input
					label={"You can Enter Username"}
					error={error}
					setter={setNickName}
				/>
			)}

			<Button text={button} callBack={callBack[button]} />
		</div>
	);
}
