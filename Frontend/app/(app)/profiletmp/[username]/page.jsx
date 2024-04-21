"use client";
import { useState, useEffect } from "react";
import NavBar from "../../navBar/NavBar";

import { getUser } from "./UserProfileUtils";

import FirstSection from "./Components/FirstTmp";
import SecondSection from "./Components/SecondSection";
import Image from "next/image";

import IMG from "../../home/assets/profile.png";

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

const friend = {
	image: IMG,
	name: "Sakawi",
	firstName: "oussama",
	lastName: "krich",
};

const friends = [
	friend,
	friend,
	friend,
	friend,
	friend,
	friend,
	friend,
	friend,
];

function Friend({ friend, index }) {
	return (
		<div
			className=" flex items-center gap-[20px] cursor-pointer"
			key={index}
		>
			{
				<Image
					className="size-[50px] rounded-full"
					src={friend.image}
					alt=""
				/>
			}
			<div>
				<h2 className="font-Chakra font-semibold text-[20px] text-white">
					{friend.name}
				</h2>
				<h3 className="font-Chakra font-bold text-[14px] text-[#C8C8C8]">
					{friend.firstName} {friend.lastName}{" "}
				</h3>
			</div>
		</div>
	);
}

function Friendspopup({ DisplayFriends }) {
	return (
		<div className="size-full fixed z-[3] top-0 flex items-center justify-center backdrop-blur-[5px]">
			<div className="w-[500px] max-[650px]:w-[80%] p-[20px] bg-[#343434] rounded-[25px] relative shadow-lg flex flex-col gap-[20px] items-center">
				{closeSvg(DisplayFriends)}
				<h1 className="font-Chakra font-semibold text-[36px] text-[#BABABA]">
					Friends
				</h1>
				<div className="w-[90%] h-[400px] flex flex-col gap-[20px] overflow-auto mb-[20px]">
					{friends.map((friend, index) => (
						<Friend friend={friend} index={index} />
					))}
				</div>
			</div>
		</div>
	);
}

function page({ params }) {
	const [isLoading, setLoading] = useState(true);
	const [displayFriends, setDisplayFriends] = useState();

	const [user, setUser] = useState();

	useEffect(() => {
		getUser(params.username).then((userData) => {
			setUser(userData);
			setLoading(false);
		});
	}, []);

	return (
		<>
			<NavBar />
			<main className="w-full mt-[150px] flex justify-center">
				{isLoading ? (
					<div className="text-white">is Loading.......</div>
				) : (
					<div className="w-[95%] max-[1700px]:w-[98%]  flex max-[1530px]:flex-col max-[1530px]:items-center gap-[20px]">
						<SecondSection
							otherUser={user}
							displayFriends={setDisplayFriends}
						/>
						<FirstSection />
					</div>
				)}
			</main>
			{displayFriends && (
				<Friendspopup DisplayFriends={setDisplayFriends} />
			)}
		</>
	);
}

export default page;
