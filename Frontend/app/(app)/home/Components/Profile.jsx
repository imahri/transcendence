"use client";
import { useContext } from "react";
import LevelCircle from "./LevelCircle";
import "./Profile.css";

import Image from "next/image";
import { UserContext } from "../../context";
import { IMAGE_URL } from "@/app/URLS";

function State({ number, name, color }) {
	return (
		<div className="bg-[#7D7D7D] w-[61px] h-[47px] rounded-[15px] relative flex justify-center items-end">
			<div className="bg-[#160B1E] size-[29px] rounded-full absolute top-[-5px] left-[15px] flex justify-center items-center">
				<div
					style={{ background: color }}
					className="size-[80%] rounded-full flex justify-center items-center"
				>
					<span className=" font-bold text-[11px] text-white">
						{number}
					</span>
				</div>
			</div>
			<h2 className=" font-bold text-[11px] text-[#150A1E] mb-[5px]">
				{name}
			</h2>
		</div>
	);
}

function Profile() {
	const { user, setUser } = useContext(UserContext);
	return (
		<div className="ProfileImg w-[95%] max-w-[1700px] h-[350px] rounded-[38px] bg-center bg-cover bg-no-repeat">
			<div className="size-full rounded-[38px] relative bg-gradient-to-r from-[#150A1E] to-transparent">
				<LevelCircle level={user.info.level} />

				<div className="ml-[150px] [@media(max-width:470px)]:ml-[100px] w-auto h-[40%] flex items-center">
					<div className="ml-10px">
						<h1 className="font-semibold w-[550px] text-[60px] [@media(max-width:800px)]:text-[40px] [@media(max-width:600px)]:text-[15px] [@media(max-width:750px)]:w-[200px] overflow-hidden truncate text-[#B872FE]">
							{user.username}
						</h1>
					</div>
				</div>
				<div className="w-auto h-[60%] pl-[70px] [@media(max-width:470px)]:pl-[20px] flex flex-col justify-center gap-[20px]">
					<div className="flex gap-[15px]">
						<State
							number={user.info.energy}
							name={"energy"}
							color={"#E5C310"}
						/>
						<State
							number={user.info.level}
							name={"lvl"}
							color={"#E55D10"}
						/>
						<State
							number={user.info.nb_game}
							name={"games"}
							color={"#8710E5"}
						/>
						<div className="w-[51px] h-[47px] rounded-[5px] flex justify-center items-center">
							<Image
								className="rounded-[4px]"
								src={`${IMAGE_URL}?path=${user.info.grade.image}`}
								width={70}
								height={70}
								alt="Grade"
							/>
						</div>
					</div>
					<h2 className=" font-bold text-[25px] [@media(max-width:800px)]:text-[20px] text-white w-[550px] [@media(max-width:800px)]:w-[70%] overflow-hidden truncate">
						{user.first_name} {user.last_name}
					</h2>
				</div>
				<h1 className="absolute top-[-20px] right-0 rotate-[-6deg] font-Mesthine text-[64px] [@media(max-width:1000px)]:hidden text-white">
					{user.username}
				</h1>
			</div>
		</div>
	);
}

export default Profile;
