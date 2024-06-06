import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/app/(app)/context";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import { UserProfileContext } from "../page";
import { GoChat } from "./GoChat";

async function callBack(action, friend_id, ws) {
	let my_action = action;
	if (action == "edit") return;
	else if (action == "Add Friend") my_action = "add";
	else if (action == "Accept") my_action = "accept";
	else if (action == "block") my_action = "block";
	else if (action == "Unblock") my_action = "Unblock";
	else my_action = "remove";

	const content = { action: my_action, friend_id: friend_id };
	ws.send(JSON.stringify({ action: "set_friendship", content: content }));
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

function Button({ action, color, friend_id, ws }) {
	return (
		<button
			className={`border-none rounded-[6px] w-[161px] [@media(max-width:850px)]:w-[130px] h-[40px] ${color} font-semibold text-[16px] [@media(max-width:850px)]:text-[13px] text-white cursor-pointer`}
			onClick={() => callBack(action, friend_id, ws)}
		>
			{action}
		</button>
	);
}

function updateStatus(data, setStatus, profileId) {
	console.log(data);

	if (data.friend_id == profileId) {
		setStatus(data.status);
	}
}

function Buttons({ profileUser, EditProfile }) {
	const [status, setStatus] = useState(profileUser.friendship);
	const { ws } = useContext(UserContext);

	useEffect(() => {
		if (ws) {
			const HandelMsg = (e) => {
				const data = JSON.parse(e.data);
				if (data.type == "friendShip")
					updateStatus(data, setStatus, profileUser.id);
			};
			ws.addEventListener("message", HandelMsg);

			return () => ws.removeEventListener("message", HandelMsg);
		}
	}, [ws]);

	return (
		<div className="flex justify-between items-center gap-[15px]">
			{status == "F" && <GoChat username={profileUser.username} />}
			<div
				className="flex flex-col gap-[10px] mr-[50px] [@media(max-width:850px)]:mr-[20px]"
				onClick={status == "owner" ? () => EditProfile(true) : null}
			>
				{Allbuttons.filter((element) => element.status === status).map(
					(element, index) => {
						return (
							<Button
								key={index}
								action={element.action}
								friend_id={profileUser.id}
								color={element.color}
								ws={ws}
							/>
						);
					},
				)}
			</div>
		</div>
	);
}

function Friend({ displayFriends, username }) {
	//fetch only 5 friends
	const [friends, setFriends] = useState();
	const [nbFriend, setnbFriend] = useState(0);

	useEffect(() => {
		const get5Friends = async () => {
			const [isOk, status, data] = await fetch_jwt(
				APIs.user.five_friends,
				{
					username: username,
				},
			);
			if (!isOk) {
				// setError(true); /// error
				return;
			}
			setFriends(data.friends);
			setnbFriend(data.nb - data.friends.length);
		};
		get5Friends();
	}, []);

	return (
		<div className="flex gap-[-1px]" onClick={() => displayFriends(true)}>
			{friends &&
				friends.map((fr, index) => {
					return (
						<Image
							key={index}
							src={APIs.image(fr.img)}
							width={35}
							height={35}
							className={`size-[35px] [@media(max-width:850px)]:size-[30px] rounded-full cursor-pointer ${friends.length > 1 ? "mr-[-10px]" : ""}`}
							alt="friend image"
						/>
					);
				})}
			{nbFriend > 0 && (
				<div className="size-[35px] bg-[#353535] rounded-full flex items-center justify-center">
					<span className="text-white text-[13px] font-bold">
						+{nbFriend}
					</span>
				</div>
			)}
		</div>
	);
}

function updateOnlineStatus(setOnline, e, user) {
	const data = JSON.parse(e.data);
	if (data.type == "onlineStatus") {
		const isOnline = data.status == "online";
		console.log("online status recived : ", data);
		if (user.username == data.username) setOnline(isOnline);
	}
}

function ProfileInfo({ displayFriends, EditProfile }) {
	const [online, setOnline] = useState();
	const { ws } = useContext(UserContext);
	const user = useContext(UserProfileContext);

	useEffect(() => {
		if (user.friendship == "owner") {
			setOnline(true);
			return;
		}
		if (!ws) return;
		ws.send(
			JSON.stringify({
				action: "checkStatus",
				username: user.username,
			}),
		);
		const handleMessage = (e) => {
			updateOnlineStatus(setOnline, e, user);
		};
		ws.addEventListener("message", handleMessage);

		return () => {
			ws.removeEventListener("message", handleMessage);
			ws.send(
				JSON.stringify({
					action: "end_checkStatus",
					username: user.username,
				}),
			);
		};
	}, [ws]);

	return (
		<div className="w-full h-[130px] flex items-center justify-center relative sm:h-[290px] xs:h-[290px] sm:flex-col xs:flex-col">
			<div className="rounded-full size-[160px] md:size-[130px] sm:size-[150px] absolute left-[50px] lg:left-[20px] md:left-[20px] top-[-30px] flex justify-center items-center bg-[#353535] sm:relative xs:relative sm:top-0 xs:top-0 sm:left-0 xs:left-0">
				<Image
					className="rounded-full size-[90%]"
					src={APIs.image(user.info.profile_img)}
					width={0}
					height={0}
					alt="profile image"
				/>
				<div
					className={` ${online ? "bg-[#80FF00]" : "bg-[#C3C3C3]"} size-[15px] rounded-full absolute right-7 bottom-3`}
				></div>
			</div>
			<h1 className="[@media(min-width:640px)]:hidden font-semibold text-[32px] [@media(max-width:850px)]:text-[24px] text-white">
				{user.first_name} {user.last_name}
			</h1>
			<div className="flex items-center justify-between w-full">
				<div className="ml-[220px] lg:ml-[190px] md:ml-[160px] sm:ml-[20px] xs:ml-[20px]">
					<h1 className="sm:hidden xs:hidden font-semibold text-[32px] [@media(max-width:850px)]:text-[24px] text-white">
						{user.first_name} {user.last_name}
					</h1>
					<div className="flex gap-[20px] items-center sm:flex-col xs:flex-col sm:items-start xs:items-start sm:gap-[5px] xs:gap-[5px]">
						<h2 className="font-semibold text-[24px] [@media(max-width:850px)]:text-[20px] text-white opacity-[54%]">
							@{user.username}
						</h2>
						<div className="flex gap-[30px]">
							<Friend
								displayFriends={displayFriends}
								username={user.username}
							/>
						</div>
					</div>
				</div>
				<Buttons profileUser={user} EditProfile={EditProfile} />
			</div>
		</div>
	);
}

export default ProfileInfo;
