import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { closePopopupSvg } from "@/app/(auth)/2Fa/Popup";
import { Block_URL, IMAGE_URL } from "@/app/URLS";
import React, { useEffect, useState } from "react";
import Image from "next/image";

async function deblock(friend_id, setBlockedUsers, setError) {
	const bodyData = JSON.stringify({ friend_id: friend_id });

	const [isOk, status, data] = await fetch_jwt(
		Block_URL,
		{},
		{
			method: "PUT",
			body: bodyData,
			headers: { "Content-Type": "application/json" },
		},
	);
	if (isOk) {
		setBlockedUsers((BlockedUsers) => {
			const updatedUsers = BlockedUsers.filter(
				(user) => user.id !== friend_id,
			);
			if (updatedUsers.length != 0) return updatedUsers;
			setError(true);
		});

		console.log(data);
	}
}

function Friend({ friend, setBlockedUsers, setError }) {
	return (
		<div className=" flex items-center gap-[20px] relative">
			{
				<Image
					className="size-[50px] rounded-full"
					src={`${IMAGE_URL}?path=${friend.img}`}
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
			<button
				className="absolute right-[20px] bg-greatBlue w-[100px] h-[37px] rounded-[5px] font-bold text-[16px] text-white cursor-pointer"
				onClick={() => deblock(friend.id, setBlockedUsers, setError)}
			>
				Deblock
			</button>
		</div>
	);
}

function BlockedUsers({ setPopUp }) {
	const [BlockedUsers, setBlockedUsers] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		if (!BlockedUsers) {
			//fetch all blocked users
			fetch_jwt(Block_URL).then(([isOk, status, data]) => {
				if (!isOk) {
					setError(true);
					return;
				}
				setBlockedUsers(data);
				console.log(data);
			});
		}
	}, [BlockedUsers]);

	return (
		<div className="w-[620px] [@media(max-width:650px)]:w-[90%] flex flex-col items-center gap-[20px] bg-[#343434] rounded-[25px] shadow-[0_4px_40px_5px_rgba(0,0,0,0.7)] relative">
			{closePopopupSvg(setPopUp)}
			<h1 className=" font-bold text-[25px] text-white mt-[20px] [@media(max-width:560px)]:text-[20px] [@media(max-width:460px)]:text-[16px]">
				Blocked Users
			</h1>
			<div className="w-[80%] max-h-[400px] flex flex-col gap-[20px] overflow-auto mb-[20px]">
				{BlockedUsers &&
					BlockedUsers.map((friend, index) => (
						<div key={index}>
							<Friend
								friend={friend}
								setBlockedUsers={setBlockedUsers}
								setError={setError}
							/>
						</div>
					))}
				<h1
					className={`${error ? "" : "hidden"} text-white text-center`}
				>
					No Blocked User
				</h1>
			</div>
		</div>
	);
}

export default BlockedUsers;
