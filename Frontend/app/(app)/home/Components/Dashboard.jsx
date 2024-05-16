"use client";
import LastGame from "./LastGame";
import Historic from "./Historic";
import StaffMission from "./StaffMission";
import LastNotif from "./LastNotif";
import "./Dashboard.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { MATCHES_URL } from "@/app/URLS";

async function GameHistoric(
	username,
	setLastGame,
	setGmaeHistoric,
	setLoading,
) {
	try {
		setLoading(true);
		const [isOk, status, data] = await fetch_jwt(MATCHES_URL, {
			username: username,
		});
		if (!isOk) {
			console.log(data);
			setLoading(false);
			return;
		}
		setLastGame(data.last_match);
		setGmaeHistoric(data.all);
	} catch (error) {
		console.log(error);
	}
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
		<div className="w-[95%] flex flex-col gap-[20px]">
			<div className="w-full flex justify-between gap-[20px] [@media(max-width:1500px)]:flex-wrap [@media(max-width:1500px)]:justify-center [@media(max-width:1500px)]:gap-x-[0px] [@media(max-width:1500px)]:gap-y-[20px]">
				<LastNotif />

				<div className="w-[50%] rounded-[15px] bg-[#D9D9D9] bg-opacity-[5%] [@media(max-width:1500px)]:order-1 [@media(max-width:1500px)]:w-[100%]">
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
				<StaffMission />
			</div>
		</div>
	);
}

export default Dashboard;
