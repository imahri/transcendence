import { getParticipant } from "./CommonSection";
import Image from "next/image";

function Historic({ user1, user2, place }) {
	const color =
		place == 1
			? "bg-[#1D99DF]"
			: place == 2
				? "bg-[#FF8C00]"
				: "bg-[#FFD700]";

	return (
		<div className="w-[60%] flex justify-around items-center">
			<div
				className={`${color} rounded-full size-[60px] flex justify-center items-center`}
			>
				{user1 && (
					<Image
						className="rounded-full size-[90%]"
						width={50}
						height={50}
						src={user1?.user?.img}
						alt="user Image"
					/>
				)}
			</div>
			<h1 className="text-white">Vs</h1>
			<div
				className={`${color} rounded-full size-[60px] flex justify-center items-center`}
			>
				{user2 && (
					<Image
						className="rounded-full size-[90%]"
						width={50}
						height={50}
						src={user2?.user?.img}
						alt="user Image"
					/>
				)}
			</div>
		</div>
	);
}

function Round({ round, match1, match2, match3, match4 }) {
	const place = round == "1st" ? 1 : round == "2nd" ? 2 : 3;

	return (
		<div className="w-[90%] bg-[#252525] rounded-lg flex flex-col items-center gap-[15px] p-[10px]">
			<h1 className="text-[#7B7B7B] font-semibold text-[20px]">
				{round} Round
			</h1>
			<Historic user1={match1.user1} user2={match1.user2} place={place} />
			{match2 && (
				<Historic
					user1={match2.user1}
					user2={match2.user2}
					place={place}
				/>
			)}
			{match3 && (
				<Historic
					user1={match3.user1}
					user2={match3.user2}
					place={place}
				/>
			)}
			{match4 && (
				<Historic
					user1={match4.user1}
					user2={match4.user2}
					place={place}
				/>
			)}
		</div>
	);
}

function getSchedule(participants, schedule) {
	const result = {
		1: { user1: null, user2: null }, //first match First 3rd : 1
		2: { user1: null, user2: null }, //first match second 3rd : 2
		3: { user1: null, user2: null }, //first match First 3rd : 3
		4: { user1: null, user2: null }, //first match Second 3rd : 4
		5: { user1: null, user2: null }, //Second match First 2nd : 5
		6: { user1: null, user2: null }, //Second match Second 2nd : 6
		7: { user1: null, user2: null }, //last match last
	};

	const FirstSide = schedule.FirstSide;
	const SecondSide = schedule.SecondSide;

	result[1].user1 = FirstSide["3rd"]
		? getParticipant(participants, FirstSide["3rd"]["1"]?.[0])
		: null;

	result[1].user2 = FirstSide["3rd"]
		? getParticipant(participants, FirstSide["3rd"]["1"]?.[1])
		: null;

	result[2].user1 = SecondSide["3rd"]
		? getParticipant(participants, SecondSide["3rd"]["2"]?.[0])
		: null;
	result[2].user2 = SecondSide["3rd"]
		? getParticipant(participants, SecondSide["3rd"]["2"]?.[1])
		: null;

	result[3].user1 = FirstSide["3rd"]
		? getParticipant(participants, FirstSide["3rd"]["3"]?.[0])
		: null;
	result[3].user2 = FirstSide["3rd"]
		? getParticipant(participants, FirstSide["3rd"]["3"]?.[1])
		: null;

	result[4].user1 = SecondSide["3rd"]
		? getParticipant(participants, SecondSide["3rd"]["4"]?.[0])
		: null;
	result[4].user2 = SecondSide["3rd"]
		? getParticipant(participants, SecondSide["3rd"]["4"]?.[1])
		: null;

	result[5].user1 = FirstSide["2nd"]
		? getParticipant(participants, FirstSide["2nd"]["5"]?.[0])
		: null;
	result[5].user2 = FirstSide["2nd"]
		? getParticipant(participants, FirstSide["2nd"]["5"]?.[1])
		: null;

	result[6].user1 = SecondSide["2nd"]
		? getParticipant(participants, SecondSide["2nd"]["6"]?.[0])
		: null;
	result[6].user2 = SecondSide["2nd"]
		? getParticipant(participants, SecondSide["2nd"]["6"]?.[1])
		: null;

	result[7].user1 = FirstSide["1st"]
		? getParticipant(participants, FirstSide["1st"])
		: null;
	result[7].user2 = SecondSide["1st"]
		? getParticipant(participants, SecondSide["1st"])
		: null;

	return result;
}

export default function SmallComponnent({ tournament }) {
	const participants = tournament.participants;

	const Schedule = getSchedule(participants, tournament.schedule);

	return (
		<div className="w-[95%] rounded-[45px] flex flex-col justify-center items-center gap-[20px] p-[20px]">
			<Round
				round={"1st"}
				match1={Schedule[1]}
				match2={Schedule[2]}
				match3={Schedule[3]}
				match4={Schedule[4]}
			/>
			<Round
				round={"2nd"}
				result={Schedule}
				match1={Schedule[5]}
				match2={Schedule[6]}
			/>
			<Round round={"3rd"} result={Schedule} match1={Schedule[7]} />
		</div>
	);
}
