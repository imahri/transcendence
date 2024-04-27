"use client";
import { useContext } from "react";
import Image from "next/image";
import logo from "@/app/logo.svg";
import { UserContext } from "../../context";

function Badge(props) {
	const { user } = useContext(UserContext);

	const badgeInfo = props.BadgeInfo;

	const levelPercent = user.info.level.toString().split(".")[1];
	const progresBarstyle = {
		width: `${levelPercent}%`,
		backgroundColor: badgeInfo.color,
	};
	const background_style = {
		backgroundImage: `url("${badgeInfo.image}")`,
	};

	return (
		<>
			<div
				style={background_style}
				className="bg-center bg-cover bg-no-repeat rounded-[20px] size-full cursor-pointer"
			>
				<div className="size-full rounded-[20px] flex flex-col justify-center relative bg-gradient-to-r from-black bg-opacity-76 to-transparent">
					{/* <div className={styles.gradient}> */}
					<Image
						className="absolute size-[40px] top-[15px] right-[5px]"
						src={logo}
						alt=""
					/>
					<div className="h-[20%]">
						<h1 className="text-[#F3F3F3] flex text-[13px] font-bold pl-[25px]">
							XXXX Profile
						</h1>
					</div>

					<div className="flex items-center h-[40%] mb-[20px] ml-[15px]">
						<Image
							className="rounded-[8px] size-[51px]"
							width={0}
							height={0}
							src={user.info.profile_img}
							alt=""
						/>
						<div className="flex flex-col justify-center ml-[10px]">
							<h2 className="text-[#F3F3F3] text-[9px] font-bold">
								Name{" "}
								<span className="text-[#C5998B] text-[10px]">
									{" "}
									{user.username}{" "}
								</span>
							</h2>
							<h2 className="text-[#F3F3F3] text-[9px] font-bold">
								Email{" "}
								<span className="text-[#C5998B] text-[10px]">
									{" "}
									{user.email}{" "}
								</span>
							</h2>
							<h2 className="text-[#F3F3F3] text-[9px] font-bold">
								Rank{" "}
								<span className="text-[#C5998B] text-[10px]">
									{" "}
									{user.rank}{" "}
								</span>
							</h2>
						</div>
					</div>
					<div className="w-[90%] h-[15%] ml-[5%] rounded-[10px] relative bg-gray-300 bg-opacity-15 shadow-md">
						<div
							style={progresBarstyle}
							className="h-full rounded-[10px]"
						></div>
						<h1 className="absolute top-[6px] left-[38%] text-black text-opacity-[43%] text-[12px] font-bold">
							level {user.info.level}%
						</h1>
					</div>
				</div>
			</div>
		</>
	);
}

export default Badge;
