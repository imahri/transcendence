import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { Input, myseterror } from "./CreateTournament";
import Image from "next/image";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { TOURNAMENT_URL } from "@/app/URLS";

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

async function joinTournament(id, user, nickname, setError, setDemo) {
	//PUT add user to a tournament
	if (!nickname) nickname = user.username;
	const body = JSON.stringify({ tournament_id: id, alias_name: nickname });

	const [isOk, status, data] = await fetch_jwt(
		TOURNAMENT_URL,
		{},
		{
			method: "PUT",
			body: body,
			headers: { "Content-Type": "application/json" },
		},
	);

	if (!isOk) {
		console.log(data);
		myseterror(setError, true);
		return;
	}
	setDemo(data);
}

export default function Demo({ Tournament, setDemo }) {
	const { user } = useContext(UserContext);
	const users = Tournament.participants;
	const full = users.length == 8;
	const alreadyIn = Tournament.participants.find(
		(obj) => obj.user.id == user.id,
	)
		? true
		: false;
	const button = alreadyIn ? "Quit" : full ? "Full" : "Join";
	const [nickname, setNickName] = useState();
	const [error, setError] = useState();

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
			{!full && !alreadyIn && (
				<Input
					label={"You can Enter Username"}
					error={error}
					setter={setNickName}
				/>
			)}
			<button
				className={`${full ? "cursor-not-allowed bg-blue-600" : "cursor-pointer bg-green-500  bg-opacity-70"} w-[138px] h-[37px] rounded-[10px]  font-bold text-[16px] text-white relative`}
				onClick={() =>
					joinTournament(
						Tournament.id,
						user,
						nickname,
						setError,
						setDemo,
					)
				}
				disabled={full}
			>
				{button}
			</button>
		</div>
	);
}
