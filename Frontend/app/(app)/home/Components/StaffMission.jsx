"use client";
import { useContext, useEffect, useState } from "react";
import { Mission, GameMission } from "./Mission";
import { closePopopupSvg } from "@/app/(auth)/2Fa/Popup";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import Loading from "@/app/(auth)/Loading";
import { UserContext } from "../../context";

function Task({ tasks }) {
	return (
		<div className="size-full flex flex-col items-center gap-[20px] mt-[20px]">
			<h1 className="text-white font-bold text-[20px]">Tasks</h1>
			<div className="h-[70%] w-[80%] flex flex-col items-center gap-[10px] overflow-y-scroll pr-[10px]">
				{tasks.map((obj, index) => {
					return (
						<div
							key={index}
							className="w-full flex justify-between items-center"
						>
							<h2
								className={`${obj.state == "completed" ? "text-opacity-40" : ""} text-white font-normal`}
							>
								{obj.task}
							</h2>
							<h2
								className={`${obj.state == "completed" ? "text-opacity-40" : ""} text-white font-normal text-[12px]`}
							>
								{obj.state}
							</h2>
						</div>
					);
				})}
			</div>
		</div>
	);
}

async function verify(setMissions, setverify, setUpdate) {
	setverify(true);
	setTimeout(() => {
		setverify(false);
	}, 500);

	const [isOk, status, data] = await fetch_jwt(
		APIs.game.missions,
		{},
		{ method: "PUT" },
	);
	if (isOk) {
		setMissions((prev) => {
			return {
				...prev,
				ChatMission: {
					...prev.ChatMission,
					status: data.chatMission,
				},
				GameMission: {
					...prev.GameMission,
					status: data.gameMission,
				},
				UserMission: {
					...prev.UserMission,
					status: data.userMission,
				},
			};
		});
		setUpdate(true);
		return;
	}
	console.log(data);
}

function StaffMission() {
	const [popUp, setPopup] = useState();
	const [missions, setMissions] = useState();
	const [isLoading, setLoading] = useState(true);
	const [verifyLoading, setverify] = useState();
	const { setUpdate } = useContext(UserContext);

	useEffect(() => {
		if (!missions) {
			const getMission = async (setMissions) => {
				const [isOk, status, data] = await fetch_jwt(
					APIs.game.missions,
				);
				if (isOk) {
					setMissions(data);
					setLoading(false);
					return;
				}
				setLoading(false);
			};
			getMission(setMissions);
		}
	}, []);

	return (
		<div className="w-[50%] flex flex-col items-end gap-[10px] relative [@media(max-width:710px)]:w-full">
			<div className="w-[90%] h-[55px] bg-[#2A2A2A] rounded-[7px] flex justify-center items-center [@media(max-width:710px)]:w-[100%]">
				<h1 className=" font-bold text-[20px] text-white text-center">
					Staff Mission
				</h1>
			</div>

			<div className="w-[90%]  [@media(max-width:710px)]:w-full h-[272px] flex flex-col gap-[10px] relative">
				<div className="w-full h-[156px] rounded-[7px] flex justify-between gap-[10px]">
					<Mission
						mission={missions?.UserMission}
						setPopup={setPopup}
						isLoading={isLoading}
						title={"User"}
					/>
					<Mission
						mission={missions?.ChatMission}
						setPopup={setPopup}
						isLoading={isLoading}
						title={"Chat"}
					/>
				</div>
				<GameMission
					mission={missions?.GameMission}
					setPopup={setPopup}
					isLoading={isLoading}
				/>
			</div>
			<button
				className="w-[90%] h-[70px] bg-[#4FA1EC] bg-opacity-[61%] rounded-[7px] font-bold text-[20px] text-white [@media(max-width:710px)]:w-[100%] relative"
				onClick={() => {
					verify(setMissions, setverify, setUpdate);
				}}
			>
				Verify
				{verifyLoading && <Loading />}
			</button>

			<div
				className={`${popUp ? "" : "hidden"} w-[90%] [@media(max-width:710px)]:w-[100%] h-[282px] bg-[#2A2A2A] absolute top-[60px] rounded-[7px] animate-pop`}
			>
				{closePopopupSvg(setPopup)}
				{popUp && <Task tasks={popUp} />}
			</div>
		</div>
	);
}

export default StaffMission;
