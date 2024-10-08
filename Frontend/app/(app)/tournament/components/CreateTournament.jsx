import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";

export function Input({ label, setter, error }) {
	return (
		<div
			className={`${error ? "animate-shake" : ""} w-[80%] [@media(max-width:600px)]:w-[95%] h-[55px]  bg-[#343434] rounded-[5px] pt-[5px] flex`}
		>
			<label
				className={`absolute text-[#8C8C8C] text-sm  mt-[-2px] ml-[19px]`}
			>
				{label}
			</label>
			<input
				className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
				type="text"
				onChange={(e) => {
					setter(e.currentTarget.value);
				}}
			/>
		</div>
	);
}

export function myseterror(setError, error) {
	setError(error);
	setTimeout(() => {
		setError(false);
	}, 5000);
}

async function handleCreate(user, username, Tournament, setError) {
	if (!Tournament) {
		myseterror(setError, "tournament");
		return;
	}
	if (!username) username = user.username;

	const body = JSON.stringify({
		tournament_name: Tournament,
		alias_name: username,
	});

	const [isOk, status, data] = await fetch_jwt(
		APIs.tournament.tournament,
		{},
		{
			method: "POST",
			body: body,
			headers: { "Content-Type": "application/json" },
		},
	);

	if (!isOk) {
		myseterror(setError, "tournament");
		return;
	}
	myseterror(setError, "success");
}

export default function Create() {
	const [username, setUsername] = useState();
	const [Tournament, setTournament] = useState();
	const [error, setError] = useState();
	const { user } = useContext(UserContext);

	return (
		<div className="size-full flex flex-col items-center justify-center gap-[20px] pt-[20px]">
			<h1 className="text-white text-opacity-40 font-semibold text-[20px] [@media(max-width:470px)]:text-[13px]">
				Creat Tournament
			</h1>

			<Input
				label={"Enter Tournament Name"}
				error={error == "tournament"}
				setter={setTournament}
			/>
			<Input
				label={"Enter Username"}
				error={error == "username"}
				setter={setUsername}
			/>
			<button
				className="w-[138px] h-[37px] bg-green-500 bg-opacity-70 rounded-[10px]  font-bold text-[16px] cursor-pointer text-white relative"
				onClick={() =>
					handleCreate(user, username, Tournament, setError)
				}
			>
				Create
			</button>
			<div
				className={`${error ? "" : "hidden"} ${error == "success" ? "bg-green-500" : "bg-red-600"} animate-shake px-[10px] min-w-[80%] h-[40px] flex justify-center items-center bg-opacity-70 rounded-[10px] font-bold text-[14px] cursor-pointer text-white`}
			>
				{error == "success"
					? "success"
					: "Change Tournament name or username"}
			</div>
		</div>
	);
}
