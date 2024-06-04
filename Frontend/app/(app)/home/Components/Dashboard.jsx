"use client";
import { useContext, useEffect, useState } from "react";
import "./Dashboard.css";
import LastGame from "./LastGame";
import Historic from "./Historic";
import StaffMission from "./StaffMission";
import LastNotif from "./LastNotif";
import { UserContext } from "../../context";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";

async function GameHistoric(
	username,
	setLastGame,
	setGmaeHistoric,
	setLoading,
) {
	setLoading(true);
	const [isOk, status, data] = await fetch_jwt(APIs.game.matches, {
		username: username,
	});
	if (!isOk) {
		console.log(data);
		setLoading(false);
		return;
	}
	setLastGame(data.last_match);
	setGmaeHistoric(data.all);
	setLoading(false);
}

function Dashboard() {
	const { user } = useContext(UserContext);
	const [lastGame, setLastGame] = useState();
	const [gameHistoric, setGmaeHistoric] = useState();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		GameHistoric(user.username, setLastGame, setGmaeHistoric, setLoading);
	}, []);

	return (
		<div className="w-[95%] max-w-[1700px] flex flex-col gap-[20px]">
			<div className="w-full rounded-[15px] bg-[#D9D9D9] bg-opacity-[5%]">
				<div className="dashboardBack flex rounded-[15px] bg-center bg-cover bg-no-repeat [@media(max-width:720px)]:flex-col [@media(max-width:720px)]:items-center">
					<LastGame
						User={user}
						lastgame={lastGame}
						isLoading={isLoading}
					/>
					<Historic
						User={user}
						gameHistoric={gameHistoric}
						isLoading={isLoading}
					/>
				</div>
			</div>
			<div className="w-full flex justify-between gap-[20px] [@media(max-width:710px)]:flex-col [@media(max-width:710px)]:items-center">
				<LastNotif />
				<StaffMission />
			</div>
		</div>
	);
}

export default Dashboard;
