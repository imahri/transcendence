"use client";
import Image from "next/image";
import logo from "@/app/logo.svg";
import { APIs } from "@/Tools/fetch_jwt_client";

function Badge({ user, BadgeInfo }) {

	const levelPercent = user.info.level.toString().split(".")[1];
	const progresBarstyle = {
		width: `${levelPercent}%`,
		backgroundColor: BadgeInfo.color,
	};
	const url = APIs.image(BadgeInfo.image_path);
	const background_style = {
		backgroundImage: `url("${url}")`,
	};

	return (
		<>
			<div
				style={background_style}
				className="bg-center bg-cover bg-no-repeat rounded-[20px] size-full cursor-pointer"
			>
				<div className="size-full rounded-[20px] flex flex-col justify-center relative bg-gradient-to-r from-black bg-opacity-76 to-transparent">
					<Image
						className="absolute size-[40px] top-[15px] right-[5px]"
						src={logo}
						alt=""
					/>
					<div className="h-[20%]">
						<h1 className="text-[#F3F3F3] flex text-[13px] font-bold pl-[25px]">
							{user.username} Badge
						</h1>
					</div>

					<div className="flex items-center h-[40%] mb-[20px] ml-[15px]">
						<Image
							className="rounded-[8px] size-[51px]"
							width={0}
							height={0}
							src={APIs.image(user.info.profile_img)}
							alt="profile image"
						/>
						<div className="flex flex-col justify-center ml-[10px]">
							<h2 className="text-[#F3F3F3] text-[9px] font-bold flex justify-between items-center">
								First Name
								<span className="ml-[5px] text-[#C5998B] text-[10px]">
									{user.first_name}
								</span>
							</h2>
							<h2 className=" text-[#F3F3F3] text-[9px] font-bold">
								Last Name
								<span className="ml-[5px] text-[#C5998B] text-[10px]">
									{user.last_name}
								</span>
							</h2>
							<h2 className="text-[#F3F3F3] text-[9px] font-bold">
								Rank
								<span className="ml-[5px] text-[#C5998B] text-[10px]">
									{user.info.grade.name}
								</span>
							</h2>
						</div>
					</div>
					<div className="w-[90%] h-[15%] ml-[5%] rounded-[10px] relative bg-gray-300 bg-opacity-15 shadow-md flex justify-center items-center">
						<div
							style={progresBarstyle}
							className="absolute h-full rounded-[10px] left-0"
						></div>
						<h1 className="z-20 text-black text-opacity-[43%] text-[12px] font-bold">
							level {user.info.level}%
						</h1>
					</div>
				</div>
			</div>
		</>
	);
}

export default Badge;
