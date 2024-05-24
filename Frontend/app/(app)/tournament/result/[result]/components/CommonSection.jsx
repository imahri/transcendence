"use client";
import Image from "next/image";
import rigthArrow from "../../../assets/Rarrow.png";
import RcolorArrow from "../../../assets/Rarrowcolor.png";
import leftArrow from "../../../assets/arrow.png";
import colorArrow from "../../../assets/arrowcolor.png";
import Trophy from "../../../assets/Trophy.png";

function UserImage({ user, nb }) {
	return (
		<div
			className={`rounded-full  size-[70px] ${nb == 1 ? "bg-[#1D99DF]" : "bg-[#FF8C00]"} flex justify-center items-center`}
		>
			{user && (
				<Image
					className="rounded-full size-[95%]"
					width={70}
					height={70}
					src={user?.user?.img}
					alt="user Image"
				/>
			)}
		</div>
	);
}

export function LastMatch({ tournament, participants }) {
	const first = tournament?.FirstSide["1st"];
	const second = tournament?.SecondSide["1st"];

	const user1 = first ? getParticipant(participants, first) : null;
	const user2 = second ? getParticipant(participants, second) : null;

	return (
		<div className="h-full w-[40%] relative flex justify-center items-center">
			<div className="w-full flex justify-around items-center">
				<div className="rounded-full [@media(max-width:1250px)]:size-[70px] size-[80px] bg-[#FFD700] flex justify-center items-center">
					{user1 && (
						<Image
							className="rounded-full size-[95%]"
							width={70}
							height={70}
							src={user1?.user?.img}
							alt="user Image"
						/>
					)}
				</div>
				<Image
					className="size-[100px] [@media(max-width:1250px)]:size-[70px]"
					src={Trophy}
					alt="Trophy image"
				/>
				<div className="rounded-full [@media(max-width:1250px)]:size-[70px]  size-[80px] bg-[#FFD700] flex justify-center items-center">
					{user2 && (
						<Image
							className="rounded-full size-[9%]"
							width={70}
							height={70}
							src={user2?.user?.img}
							alt="user Image"
						/>
					)}
				</div>
			</div>
		</div>
	);
}

function FirstMatch({ user1, user2, isLeft }) {
	return (
		<div className="h-1/2 flex items-center justify-between gap-[5px]">
			{!isLeft && (
				<Image
					className="h-[85%] [@media(max-width:1250px)]:w-[50%] w-[60%]"
					src={rigthArrow}
					alt=""
				/>
			)}
			<div className="h-full flex flex-col justify-between">
				<UserImage user={user1} nb={1} />
				<UserImage user={user2} nb={1} />
			</div>
			{isLeft && (
				<Image
					className="h-[85%] [@media(max-width:1250px)]:w-[50%] w-[60%]"
					src={leftArrow}
					alt=""
				/>
			)}
		</div>
	);
}

function SecondMatch({ user1, user2, isLeft }) {
	return (
		<div className="h-[70%] w-1/2 flex items-center gap-[10px]">
			{!isLeft && (
				<Image
					className="h-[70%] [@media(max-width:1250px)]:w-[50%]"
					src={RcolorArrow}
					alt=""
				/>
			)}
			<div className="h-[80%] flex flex-col justify-between">
				<UserImage user={user1} nb={2} />
				<UserImage user={user2} nb={2} />
			</div>
			{isLeft && (
				<Image
					className="h-[70%] [@media(max-width:1250px)]:w-[50%] "
					src={colorArrow}
					alt=""
				/>
			)}
		</div>
	);
}

export function getParticipant(participants, participant) {
	if (!participant) return null;
	const result = participants.find((obj) => obj.name == participant.name);
	return result;
}

function CommonSection({ isLeft, tournament, participants }) {
	const third = tournament ? tournament["3rd"] : null;
	const second = tournament ? tournament["2nd"] : null;

	const plus = !isLeft;

	const user1 = third
		? getParticipant(participants, tournament["3rd"][`${1 + plus}`]?.[0])
		: null;
	const user2 = third
		? getParticipant(participants, tournament["3rd"][`${1 + plus}`]?.[1])
		: null;
	const user3 = third
		? getParticipant(participants, tournament["3rd"][`${3 + plus}`]?.[0])
		: null;
	const user4 = third
		? getParticipant(participants, tournament["3rd"][`${3 + plus}`]?.[1])
		: null;
	const user5 = second
		? getParticipant(participants, tournament["2nd"][`${5 + plus}`]?.[0])
		: null;
	const user6 = second
		? getParticipant(participants, tournament["2nd"][`${5 + plus}`]?.[1])
		: null;

	return (
		<div className="h-full w-[40%] flex items-center gap-[10px]">
			{!isLeft && (
				<SecondMatch user1={user5} user2={user6} isLeft={isLeft} />
			)}
			<div
				className={`${isLeft ? "pl-[20px]" : "pr-[20px]"} h-full w-[50%] flex flex-col  gap-[20px] py-[20px]`}
			>
				<FirstMatch user1={user1} user2={user2} isLeft={isLeft} />
				<FirstMatch user1={user3} user2={user4} isLeft={isLeft} />
			</div>
			{isLeft && (
				<SecondMatch user1={user5} user2={user6} isLeft={isLeft} />
			)}
		</div>
	);
}

export default CommonSection;
