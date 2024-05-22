"use client";

import CommonSection, {
	LastMatch,
	getParticipant,
} from "./components/CommonSection";
import { useEffect, useState } from "react";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { GETTOURNAMENT_URL } from "@/app/URLS";
import { useRouter } from "next/navigation";
import Image from "next/image";

async function getTournament(
	tournamentName,
	setTournament,
	setIsLoding,
	navigate,
) {
	const [isOk, status, data] = await fetch_jwt(
		GETTOURNAMENT_URL + tournamentName,
	);

	if (!isOk) {
		navigate.push("/tournament");
		return;
	}
	setTournament(data);
	setIsLoding(false);
}

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

function Round({ round, place, tournament, participants }) {
	const places = { 1: "3rd", 2: "2nd", 3: "1st" };
	const current = places[place];

	const user1 = tournament.FirstSide[current]
		? getParticipant(participants, tournament.FirstSide[current][0][0])
		: null;
	const user2 = tournament.FirstSide[current]
		? getParticipant(participants, tournament.FirstSide[current][0][1])
		: null;
	const user3 = tournament.SecondSide[current]
		? getParticipant(participants, tournament.SecondSide[current][1][0])
		: null;
	const user4 = tournament.SecondSide[current]
		? getParticipant(participants, tournament.SecondSide[current][1][1])
		: null;

	return (
		<div className="w-[90%] bg-[#252525] rounded-lg flex flex-col items-center gap-[15px] p-[10px]">
			<h1 className="text-[#7B7B7B] font-semibold text-[20px]">
				{round} Round
			</h1>
			<Historic user1={user1} user2={user2} place={place} />
			<Historic user1={user3} user2={user4} place={place} />
		</div>
	);
}

function SmallComponnent({ tournament }) {
	return (
		<div className="w-[95%] rounded-[45px] flex flex-col justify-center items-center gap-[20px] p-[20px]">
			<Round
				round={"1st"}
				place={1}
				tournament={tournament.schedule}
				participants={tournament.participants}
			/>
			<Round
				round={"2nd"}
				place={2}
				tournament={tournament.schedule}
				participants={tournament.participants}
			/>
			<Round
				round={"3rd"}
				place={3}
				tournament={tournament.schedule}
				participants={tournament.participants}
			/>
		</div>
	);
}

function page({ params }) {
	const [isLoading, setIsLoding] = useState(true);
	const [tournament, setTournament] = useState();
	const [isSmall, setIsSmall] = useState(false);
	const navigate = useRouter();

	useEffect(() => {
		const TournamentName = params.result;
		getTournament(TournamentName, setTournament, setIsLoding, navigate);
	}, []);

	const checkWindowWidth = () => {
		const specificWidth = 800;
		if (window.innerWidth <= specificWidth) setIsSmall(true);
		else setIsSmall(false);
	};

	useEffect(() => {
		checkWindowWidth();
		window.addEventListener("resize", checkWindowWidth);

		return () => window.removeEventListener("resize", checkWindowWidth);
	}, []);

	return (
		<>
			{isLoading && <div>is Loading...</div>}

			{!isLoading && (
				<div className="size-full flex flex-col items-center justify-center gap-[20px]">
					<h1 className="text-[#7B7B7B] font-semibold text-[40px]">
						Tournament
					</h1>
					{!isSmall && (
						<div className="w-[95%] max-w-[1300px] h-[800px] bg-black bg-opacity-45 rounded-[45px] flex justify-between gap-[10px]">
							<CommonSection
								isLeft={true}
								tournament={tournament.schedule.FirstSide}
								participants={tournament.participants}
							/>
							<LastMatch
								tournament={tournament.schedule}
								participants={tournament.participants}
							/>
							<CommonSection
								isLeft={false}
								tournament={tournament.schedule.SecondSide}
								participants={tournament.participants}
							/>
						</div>
					)}
					{isSmall && <SmallComponnent tournament={tournament} />}
				</div>
			)}
		</>
	);
}

export default page;
