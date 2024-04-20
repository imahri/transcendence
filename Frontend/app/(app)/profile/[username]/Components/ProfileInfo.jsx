import Image from "next/image";
import { useState, useEffect, useContext } from "react";
import { initSocket } from "./FriendShipsocket";

import IMG from "../../../home/assets/profile.png";
import { UserContext } from "@/app/(app)/layout";

function callBack(socket, action, friend_id) {
	let update;
	if (action == "edit") {
		return;
	} else if (action == "Add Friend")
		update = { action: "add", friend_id: friend_id };
	else if (action == "Accept")
		update = { action: "accept", friend_id: friend_id };
	else if (action == "block")
		update = { action: "block", friend_id: friend_id };
	else if (
		action == "Reject" ||
		action == "Remove Friend" ||
		action == "Unblock" ||
		action == "remove Request"
	)
		update = { action: "remove", friend_id: friend_id };
	else return;

	socket.send(JSON.stringify(update));
}

const createButton = (status, color, action) => {
	return { status: status, color: color, action: action };
};
const Allbuttons = [
	createButton("owner", "bg-blue-600", "Edit"),
	createButton("not friend", "bg-green-600", "Add Friend"),
	createButton("B", "bg-gray-600", "Blocked"),
	createButton("B", "bg-green-600", "Unblock"),
	createButton("W", "bg-red-600", "remove Request"),
	createButton("I", "bg-green-600", "Accept"),
	createButton("I", "bg-red-600", "Reject"),
	createButton("F", "bg-gray-600", "block"),
	createButton("F", "bg-red-600", "Remove Friend"),
	createButton("BY", "bg-red-600", "User Blocked You"),
];

function Button({ action, color, socket, friend_id }) {
	return (
		<button
			className={`border-none rounded-[6px] w-[161px] h-[40px] ${color} font-semibold text-[16px] text-white cursor-pointer`}
			onClick={() => callBack(socket, action, friend_id)}
		>
			{action}
		</button>
	);
}

function Buttons({ profileUser }) {
	const [status, setStatus] = useState();
	const [socket, setSocket] = useState();

	// useEffect(() => {
	// 	initSocket(setSocket, setStatus, profileUser);

	// 	return () => {
	// 		if (socket) socket.close();
	// 	};
	// }, []);
	const { ws } = useContext(UserContext);
	// console.log('ws : ', ws);

	useEffect(() => {
		initSocket(ws, setStatus, profileUser);
		setSocket(ws);

		// return () => {
		// 	if (socket) socket.close();
		// };
	}, []);

	return (
		<div className="flex flex-col gap-[10px] ">
			{Allbuttons.filter((element) => element.status === status).map(
				(element, index) => {
					return (
						<Button
							key={index}
							action={element.action}
							socket={socket}
							friend_id={profileUser.id}
							color={element.color}
						/>
					);
				},
			)}
		</div>
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

function Friend({ displayFriends }) {
	return (
		<div className="flex gap-[-1px]" onClick={() => displayFriends(true)}>
			{friends.slice(0, 5).map((fr, index) => {
				return (
					<Image
						key={index}
						className="size-[35px] cursor-pointer rounded-full mr-[-10px]"
						src={fr.image}
						alt=""
					/>
				);
			})}
			<div className="size-[35px] bg-[#353535] rounded-full flex items-center justify-center">
				<span className="text-white text-[13px] font-bold">+15</span>
			</div>
		</div>
	);
}

function ProfileInfo({ user, displayFriends }) {
	return (
		<div className="w-full h-[130px]  flex items-center justify-between relative">
			<Image
				className="rounded-[31px] w-[138px] h-[126px] absolute top-[-20px] left-[50px]"
				src={user.info.profile_img}
				width={0}
				height={0}
				alt=""
			/>
			<div className="ml-[200px]">
				<h1 className="font-semibold text-[40px] text-white">
					{user.first_name} {user.last_name}
				</h1>
				<div className="flex gap-[30px]">
					{/* <h2 className="font-semibold text-[24px] text-[#ABABAB] ">
						{" "}
						Level {user.info.level}
					</h2> */}
					<Friend displayFriends={displayFriends} />
				</div>
			</div>
			<Buttons profileUser={user} />
		</div>
	);
}

export default ProfileInfo;
