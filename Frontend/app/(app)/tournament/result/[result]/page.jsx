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
import SmallComponnent from "./components/SmallComponent";

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

function Page({ params }) {
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
								tournament={tournament.schedule?.FirstSide}
								participants={tournament.participants}
							/>
							<LastMatch
								winner={tournament.winner}
								tournament={tournament.schedule}
								participants={tournament.participants}
							/>
							<CommonSection
								isLeft={false}
								tournament={tournament.schedule?.SecondSide}
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

export default Page;
