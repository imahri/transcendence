"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { GET_Friends_URL } from "@/app/URLS";

function closeSvg(DisplayFriends) {
	return (
		<svg
			onClick={() => DisplayFriends(false)}
			className="absolute top-[20px] right-[20px] cursor-pointer"
			width="20"
			height="20"
			viewBox="0 0 26 26"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16.0807 13L25.3668 3.71137C26.2111 2.86695 26.2111 1.47774 25.3668 0.633316C24.5227 -0.211105 23.1338 -0.211105 22.2896 0.633316L13.0034 9.92195L3.7172 0.633316C2.873 -0.211105 1.48416 -0.211105 0.639958 0.633316C0.217858 1.05553 0 1.61393 0 2.17234C0 2.73075 0.217858 3.28916 0.639958 3.71137L9.92616 13L0.639958 22.2886C0.217858 22.7108 0 23.2693 0 23.8277C0 24.3861 0.217858 24.9445 0.639958 25.3667C1.48416 26.2111 2.873 26.2111 3.7172 25.3667L13.0034 16.0781L22.2896 25.3667C23.1338 26.2111 24.5227 26.2111 25.3668 25.3667C26.2111 24.5223 26.2111 23.1331 25.3668 22.2886L16.0807 13Z"
				fill="white"
				fillOpacity="0.29"
			/>
		</svg>
	);
}

function Friend({ friend, index }) {
	return (
		<div
			className=" flex items-center gap-[20px] cursor-pointer"
			key={index}
		>
			{
				<Image
					className="size-[50px] rounded-full"
					src={friend.img}
					width={50}
					height={50}
					alt=""
				/>
			}
			<div>
				<h2 className="font-Chakra font-semibold text-[20px] text-white">
					{friend.username}
				</h2>
				<h3 className="font-Chakra font-bold text-[14px] text-[#C8C8C8]">
					{friend.first_name} {friend.last_name}{" "}
				</h3>
			</div>
		</div>
	);
}

export default function Friendspopup({ DisplayFriends, username }) {
	const [friends, setFriends] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		fetch_jwt(GET_Friends_URL, { username: username }).then(
			([isOk, status, data]) => {
				if (!isOk) {
					setError(true);
					return;
				}
				setFriends(data);
				console.log(data);
			},
		);
	}, []);

	return (
		<div className="size-full fixed z-[3] top-0 flex items-center justify-center backdrop-blur-[5px]">
			<div className="w-[500px] max-[650px]:w-[80%] p-[20px] bg-[#343434] rounded-[25px] relative shadow-lg flex flex-col gap-[20px] items-center">
				{closeSvg(DisplayFriends)}
				<h1 className="font-Chakra font-semibold text-[36px] text-[#BABABA]">
					Friends
				</h1>
				<div className="w-[90%] max-h-[400px] flex flex-col gap-[20px] overflow-auto mb-[20px]">
					{friends &&
						friends.map((friend, index) => (
							<Friend friend={friend} index={index} />
						))}
					{
						//style it later
						error && <h1>No Friends</h1>
					}
				</div>
			</div>
		</div>
	);
}
