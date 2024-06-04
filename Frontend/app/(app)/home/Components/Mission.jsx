import Loading from "@/app/(auth)/Loading";
import { AboutSvg, WalletSvg, MoreSvg } from "./AllSvg";
import Image from "next/image";
import { APIs } from "@/Tools/fetch_jwt_client";

export function Mission({ mission, setPopup, isLoading, title }) {
	return (
		<div
			className={`w-[50%] h-[100%] ${title == "User" ? "bg-greatBlue" : "bg-goto"} rounded-[7px] flex flex-col justify-evenly pl-[15px]  [@media(max-width:1700px)]:pl-[10px] relative`}
		>
			{isLoading && <Loading />}
			{!isLoading && (
				<>
					<div
						onClick={() => setPopup(mission?.task)}
						className="cursor-pointer size-[11px] bg-[#4F4F4F] rounded-full absolute top-[10px] right-[10px] flex justify-center items-center"
					>
						{AboutSvg}
					</div>
					<h3 className=" font-bold text-[15px] text-white">
						{mission?.title}
					</h3>
					<h1 className=" font-bold text-[30px] text-white">
						{mission?.exp}
						<span className=" font-bold text-[14px] text-white">
							Exp
						</span>
					</h1>
					<div>
						<h3 className=" font-bold text-[8px] text-[#E6E6E6]">
							Prize
						</h3>
						<div className="w-[85px] bg-[#D9D9D9] bg-opacity-[19%] rounded-[2px] flex  items-center justify-center gap-[10px] ml-[10px]">
							<h3 className=" font-bold text-[14px] text-white flex justify-center items-center gap-[5px]">
								{mission?.prize.wallet} {WalletSvg}
							</h3>
							<Image
								className="h-[30px] w-[27px]"
								width={27}
								height={30}
								src={APIs.image(
									mission?.prize.Acheivment.icon_path,
								)}
								alt="acheivment"
							/>
						</div>
					</div>
					<div
						className="cursor-pointer w-[95%] h-[30px] flex items-center justify-between"
						onClick={() => setPopup(mission?.task)}
					>
						<div>
							<h1 className="font-bold text-[11px] text-white">
								{mission?.owner.userName}
							</h1>
							<h2 className="font-bold text-[9px] text-[#C8C8C8]">
								{mission?.owner.fullName}
							</h2>
						</div>
						{MoreSvg}
					</div>
					<div
						className={`${mission?.status == "completed" ? "" : "hidden"} size-full bg-[#353535] bg-opacity-75 absolute left-0 flex justify-center items-center font-bold text-[17px] text-white`}
					>
						completed
					</div>
				</>
			)}
		</div>
	);
}

export function GameMission({ mission, setPopup, isLoading }) {
	return (
		<div
			className={`w-full h-[106px] bg-the_great rounded-[7px] flex items-center justify-between relative [@media(max-width:710px)]:w-[100%]`}
		>
			{isLoading && <Loading />}
			{!isLoading && (
				<>
					<div
						onClick={() => setPopup(mission?.task)}
						className="cursor-pointer size-[11px] bg-[#4F4F4F] rounded-full absolute top-[10px] right-[10px] flex justify-center items-center"
					>
						{AboutSvg}
					</div>
					<div className="pl-[20px]">
						<h3 className=" font-bold text-[15px] text-white">
							{mission?.title}
						</h3>
						<h1 className=" font-bold text-[48px] [@media(max-width:1706px)]:text-[30px] text-white">
							{mission?.exp}
							<span className=" font-bold text-[14px] text-white">
								Exp
							</span>
						</h1>
					</div>
					<div className="w-[50%] flex flex-col gap-[10px]">
						<div>
							<h3 className=" font-bold text-[8px] text-[#E6E6E6]">
								Prize
							</h3>
							<div className="w-[85px] bg-[#D9D9D9] bg-opacity-[19%] rounded-[2px] flex  items-center justify-center gap-[10px] ml-[10px]">
								<h3 className=" font-bold text-[14px] text-white flex justify-center items-center gap-[5px]">
									{mission?.prize.wallet} {WalletSvg}
								</h3>
								<Image
									className="h-[30px] w-[27px]"
									width={27}
									height={30}
									src={APIs.image(
										mission?.prize.Acheivment.icon_path,
									)}
									alt="acheivment"
								/>
							</div>
						</div>
						<div
							className="w-[95%] h-[30px] flex items-center justify-between cursor-pointer"
							onClick={() => setPopup(mission?.task)}
						>
							<div>
								<h1 className=" font-bold text-[11px] text-white">
									{mission?.owner.userName}
								</h1>
								<h2 className=" font-bold text-[9px] text-[#C8C8C8]">
									{mission?.owner.fullName}
								</h2>
							</div>
							{MoreSvg}
						</div>
					</div>
					<div
						className={`${mission?.status == "completed" ? "" : "hidden"} size-full bg-[#353535] bg-opacity-75 absolute left-0 flex justify-center items-center font-bold text-[17px] text-white`}
					>
						completed
					</div>
				</>
			)}
		</div>
	);
}
