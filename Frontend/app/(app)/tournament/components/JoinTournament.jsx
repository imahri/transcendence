import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { Input } from "./CreateTournament";
import Image from "next/image";

function UsersDemo({ user, index }) {
	return (
		<div
			key={index}
			className="w-full flex justify-between items-center gap-[10px] h-[50px]"
		>
			<h1 className="font-bold text-[17px] text-[#cccccc]">
				{user.name}
			</h1>
			<Image
				className="size-[40px] cursor-pointer rounded-full"
				src={user.img}
				alt="Friend Image"
			/>
		</div>
	);
}

function joinTournament(id, user, nickname, setError) {
	//PUT add user to a tournament
	// if (!nickname)
	// 	nickname = user.username
	// try{
	// 	const [isOk, status, data] = fetch_jwt(TOURNAMENT_URL)
	// }
	// catch {
	// }
}

export default function Demo({ Tournament }) {
	const { user } = useContext(UserContext);
	const users = Tournament.users;
	const full = Tournament.nb == 8;
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
						return <UsersDemo user={obj} index={index} />;
					})}
			</div>
			{!full && (
				<Input
					label={"You can Enter Username"}
					error={error}
					setter={setNickName}
				/>
			)}
			<button
				className={`${full ? "cursor-not-allowed bg-blue-600" : "cursor-pointer bg-green-500  bg-opacity-70"} w-[138px] h-[37px] rounded-[10px]  font-bold text-[16px] text-white relative`}
				onClick={() => joinTournament(5, user, nickname, setError)}
				disabled={full}
			>
				{full ? "Full" : "Join"}
			</button>
		</div>
	);
}
