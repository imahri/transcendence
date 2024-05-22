"use client";
import Image from "next/image";
import profile from "../../assets/profile.png";
import rigthArrow from "../../assets/Rarrow.png";
import RcolorArrow from "../../assets/Rarrowcolor.png";
import leftArrow from "../../assets/arrow.png";
import colorArrow from "../../assets/arrowcolor.png";
import Trophy from "../../assets/Trophy.png";

const result = {
	Matchone: { user1: "ok", user2: "ok" },
	Matchtow: {},
	Matchthree: {},
	hMatchfour: {},
	Matchfive: {},
	Matchsix: {},
	Matchseven: {},
};

function LeftSection({ result }) {
	return (
		<div className="h-full w-[40%] flex items-center gap-[10px]">
			<div className="h-full w-[50%] flex flex-col  gap-[20px] pl-[20px] py-[20px]">
				<div className="h-1/2 flex items-center justify-between gap-[5px]">
					<div className="h-full flex flex-col justify-between">
						<Image
							className="rounded-full size-[70px]"
							width={70}
							height={70}
							src={profile}
							alt="user Image"
						></Image>
						<Image
							className="rounded-full size-[70px]"
							width={70}
							height={70}
							src={profile}
							alt="user Image"
						></Image>
					</div>
					<Image
						className="h-[85%] w-[60%]"
						src={leftArrow}
						alt=""
					></Image>
				</div>

				<div className="h-1/2 flex items-center justify-between gap-[5px]">
					<div className="h-full flex flex-col justify-between">
						<Image
							className="rounded-full size-[70px]"
							width={70}
							height={70}
							src={profile}
							alt="user Image"
						></Image>
						<Image
							className="rounded-full size-[70px]"
							width={70}
							height={70}
							src={profile}
							alt="user Image"
						></Image>
					</div>
					<Image
						className="h-[85%] w-[60%]"
						src={leftArrow}
						alt=""
					></Image>
				</div>
			</div>
			<div className="h-[70%] w-1/2 flex items-center gap-[10px]">
				<div className="h-[80%] flex flex-col justify-between">
					<Image
						className="rounded-full size-[70px]"
						width={70}
						height={70}
						src={profile}
						alt="user Image"
					></Image>
					<Image
						className="rounded-full size-[70px]"
						width={70}
						height={70}
						src={profile}
						alt="user Image"
					></Image>
				</div>
				<Image className="h-[70%] " src={colorArrow} alt=""></Image>
			</div>
		</div>
	);
}

function RigthSection({ result }) {
	return (
		<div className="h-full w-[40%] flex items-center gap-[10px]">
			<div className="h-[70%] w-1/2 flex items-center justify-center gap-[10px]">
				<Image className="h-[70%]" src={RcolorArrow} alt=""></Image>
				<div className="h-[80%] flex flex-col justify-between">
					<Image
						className="rounded-full size-[70px]"
						width={70}
						height={70}
						src={profile}
						alt="user Image"
					></Image>
					<Image
						className="rounded-full size-[70px]"
						width={70}
						height={70}
						src={profile}
						alt="user Image"
					></Image>
				</div>
			</div>
			<div className="h-full w-[50%]  flex flex-col  gap-[20px] pr-[20px] py-[20px]">
				<div className="h-1/2 flex items-center justify-between gap-[5px]">
					<Image
						className="h-[85%] w-[60%]"
						src={rigthArrow}
						alt=""
					></Image>
					<div className="h-full flex flex-col justify-between">
						<Image
							className="rounded-full size-[70px]"
							width={70}
							height={70}
							src={profile}
							alt="user Image"
						></Image>
						<Image
							className="rounded-full size-[70px]"
							width={70}
							height={70}
							src={profile}
							alt="user Image"
						></Image>
					</div>
				</div>

				<div className="h-1/2 flex items-center justify-between gap-[5px]">
					<Image
						className="h-[85%] w-[60%]"
						src={rigthArrow}
						alt=""
					></Image>
					<div className="h-full flex flex-col justify-between">
						<Image
							className="rounded-full size-[70px]"
							width={70}
							height={70}
							src={profile}
							alt="user Image"
						></Image>
						<Image
							className="rounded-full size-[70px]"
							width={70}
							height={70}
							src={profile}
							alt="user Image"
						></Image>
					</div>
				</div>
			</div>
		</div>
	);
}

function MiddleSection({}) {
	return (
		<div className="h-full w-[20%] relative flex justify-center items-center">
			<div className="w-full flex justify-around items-center">
				<Image
					className="rounded-full size-[80px]"
					width={80}
					height={80}
					src={profile}
					alt="user Image"
				/>
				<Image
					className="size-[100px]"
					src={Trophy}
					alt="Trophy image"
				/>
				<Image
					className="rounded-full size-[80px]"
					width={80}
					height={80}
					src={profile}
					alt="user Image"
				/>
			</div>
		</div>
	);
}

function page({ params }) {
	return (
		<div className="size-full flex flex-col items-center justify-center gap-[20px]">
			<h1 className="text-[#7B7B7B] font-semibold text-[40px]">
				Tournament
			</h1>
			<div className="w-[95%] max-w-[1300px] h-[800px] bg-black bg-opacity-45 rounded-[45px] flex justify-between gap-[10px]">
				<LeftSection result={result} />
				<MiddleSection result={result} />
				<RigthSection result={result} />
			</div>
		</div>
	);
}

export default page;
