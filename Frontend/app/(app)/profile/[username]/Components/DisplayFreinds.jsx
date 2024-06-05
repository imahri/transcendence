"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import { closePopopupSvg } from "@/app/(auth)/2Fa/Popup";
import Link from "next/link";

function Friend({ friend }) {
	return (
		<Link
			className="flex items-center gap-[20px] cursor-pointer"
			href={`/profile/${friend.username}`}
		>
			{
				<Image
					className="size-[50px] rounded-full"
					src={APIs.image(friend.img)}
					width={50}
					height={50}
					alt="friend image"
				/>
			}
			<div>
				<h2 className="font-Chakra font-semibold text-[20px] text-white">
					{friend.username}
				</h2>
				<h3 className="font-Chakra font-bold text-[14px] text-[#C8C8C8]">
					{friend.first_name} {friend.last_name}
				</h3>
			</div>
		</Link>
	);
}

export default function Friendspopup({ DisplayFriends, username }) {
	const [friends, setFriends] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		const getFriends = async () => {
			const [isOk, status, data] = await fetch_jwt(
				APIs.user.other_friends,
				{
					username: username,
				},
			);
			if (!isOk) {
				setError(true);
				return;
			}
			setFriends(data);
			console.log(data);
		};
		getFriends();
	}, []);

	return (
		<div className="size-full fixed z-[3] top-0 flex items-center justify-center backdrop-blur-[5px]">
			<div className="w-[500px] max-[650px]:w-[80%] p-[20px] bg-[#343434] rounded-[25px] relative shadow-[0_4px_40px_5px_rgba(0,0,0,0.7)] flex flex-col gap-[20px] items-center">
				{closePopopupSvg(DisplayFriends)}
				<h1 className="font-Chakra font-semibold text-[36px] text-[#BABABA]">
					Friends
				</h1>
				<div className="w-[90%] max-h-[400px] flex flex-col gap-[20px] overflow-auto mb-[20px]">
					{friends &&
						friends.map((friend, index) => (
							<div key={index}>
								<Friend friend={friend} />
							</div>
						))}
					<h1
						className={`${error ? "" : "hidden"} text-white text-center`}
					>
						No Friends
					</h1>
				</div>
			</div>
		</div>
	);
}
