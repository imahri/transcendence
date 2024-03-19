"use client";
import { useContext } from "react";
import LevelCircle from "./LevelCircle";
import Myskin from "../assets/12.png";
import { UserContext } from "../../layout";
import "./Profile.css";

function State({ number, name, color }) {
	return (
		<div className="bg-[#7D7D7D] w-[61px] h-[47px] rounded-[15px] relative flex justify-center items-end">
			<div className="bg-[#160B1E] size-[29px] rounded-full absolute top-[-5px] left-[15px] flex justify-center items-center">
				<div
					style={{ background: color }}
					className="size-[80%] rounded-full flex justify-center items-center"
				>
					<span className="font-Chakra font-bold text-[11px] text-white">
						{number}
					</span>
				</div>
			</div>
			<h2 className="font-Chakra font-bold text-[11px] text-[#150A1E] mb-[5px]">
				{name}
			</h2>
		</div>
	);
}

function Profile() {
	const { user, setUser } = useContext(UserContext);

	// console.log("user: ", user);

	return (
		<div
			className="ProfileImg w-[95%] h-[406px] rounded-[38px] bg-center bg-cover bg-no-repeat"
			// style={{ backgroundImage: `url('${profileImg}')` }}
		>
			<div className="size-full rounded-[38px] relative bg-gradient-to-r from-[#150A1E] to-transparent">
				<LevelCircle level={user.info.level} />

				<div className="ml-[150px] max-[470px]:ml-[100px] w-auto h-[40%] flex items-center">
					<div className="ml-10px">
						<h1 className="font-Chakra font-semibold text-[96px] max-[800px]:text-[60px] text-[#B872FE]">
							{user.username}
						</h1>
						<h2 className="font-Chakra font-semibold text-[38px] max-[800px]:text-[25px] text-white">
							Player Name
						</h2>
					</div>
				</div>
				<div className="w-auto h-[60%] pl-[70px] max-[470px]:pl-[20px] flex flex-col justify-center gap-[20px]">
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
						<State number={12} name={"games"} color={"#8710E5"} />
						<div className="bg-[#52FF00] w-[51px] h-[47px] rounded-[5px] flex justify-center items-center">
							<img
								className="size-[90%] rounded-[4px]"
								src={Myskin}
								alt=""
							/>
						</div>
					</div>
					<h2 className="font-Chakra font-bold text-[25px] max-[800px]:text-[20px] text-white">
						{user.first_name} {user.last_name}
					</h2>
					<h2 className="font-Chakra font-bold text-[25px] max-[800px]:text-[20px] text-white">
						{user.email}
					</h2>
				</div>
				<h1 className="absolute top-[-20px] right-0 rotate-[-6deg] font-Mesthine text-[96px] max-[1000px]:hidden text-white">
					{user.username}
				</h1>
			</div>
		</div>
	);
}

export default Profile;
