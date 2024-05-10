import Image from "next/image";
import { useState, useContext, useLayoutEffect, useEffect } from "react";
import { UserContext } from "@/app/(app)/context";
import { FRIENDSHIP_URL, GET_5Friends_URL } from "@/app/URLS";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";

async function callBack(action, friend_id, setFriendShip) {
	let my_action = action;
	if (action == "edit") {
		return;
	} else if (action == "Add Friend") my_action = "add";
	else if (action == "Accept") my_action = "accept";
	else if (action == "block") my_action = "block";
	else if (action == "Unblock") my_action = "Unblock";
	if (
		action == "Reject" ||
		action == "Remove Friend" ||
		action == "remove Request"
	)
		my_action = "remove";

	const body = { action: my_action, friend_id: friend_id };

	try {
		const [isOk, status, data] = await fetch_jwt(
			FRIENDSHIP_URL,
			{},
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			},
		);

		if (isOk) {
			setFriendShip(data.status);
			return;
		}
		console.error("error friendship Post :", data);
	} catch (error) {
		console.log("send friendship error : ", error);
	}
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

function Button({ action, color, friend_id, setStatus }) {
	return (
		<button
			className={`border-none rounded-[6px] w-[161px] h-[40px] ${color} font-semibold text-[16px] text-white cursor-pointer`}
			onClick={() => callBack(action, friend_id, setStatus)}
		>
			{action}
		</button>
	);
}

function updateStatus(data, setStatus, profileId) {
	if (data.friend_id == profileId) {
		setStatus(data.status);
	}
}

function Buttons({ profileUser, EditProfile }) {
	const [status, setStatus] = useState(profileUser.friendship);
	const { ws } = useContext(UserContext);

	useEffect(() => {
		if (ws) {
			ws.addEventListener("message", (e) => {
				const data = JSON.parse(e.data);
				if (data.type == "friendShip")
					updateStatus(data, setStatus, profileUser.id);
			});
			ws.onerror = (error) => {
				console.log("error");
				console.error("WebSocket error:", error);
			};
		}
	}, []);

	return (
		<div
			className="flex flex-col gap-[10px] mr-[50px]"
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
							setStatus={setStatus}
						/>
					);
				},
			)}
		</div>
	);
}

function Friend({ displayFriends, username }) {
	//fetch only 5 friends
	const [friends, setFriends] = useState();
	const [nbFriend, setnbFriend] = useState(0);

	useEffect(() => {
		fetch_jwt(GET_5Friends_URL, { username: username }).then(
			([isOk, status, data]) => {
				if (!isOk) {
					// setError(true); /// error
					return;
				}
				setFriends(data.friends);
				setnbFriend(data.nb - data.friends.length);
			},
		);
	}, []);

	return (
		<div className="flex gap-[-1px]" onClick={() => displayFriends(true)}>
			{friends &&
				friends.map((fr, index) => {
					return (
						<Image
							key={index}
							src={fr.img}
							width={35}
							height={35}
							className={`size-[35px] rounded-full cursor-pointer ${friends.length > 1 ? "mr-[-10px]" : ""}`}
							alt=""
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

function ProfileInfo({ user, displayFriends, EditProfile }) {
	const [online, setOnline] = useState();
	const { ws } = useContext(UserContext);

	useEffect(() => {
		if (user.friendship == "owner") {
			setOnline(true);
			return;
		}
		if (!ws) {
			console.log("ws is false, userprofile");
			return;
		}

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
			console.log("end profile info");
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
		<div className="w-full h-[130px]  flex items-center justify-between relative">
			<div className="rounded-full size-[160px]  absolute left-[50px] top-[-30px] flex justify-center items-center bg-[#353535]">
				<Image
					className="rounded-full size-[90%]"
					src={user.info.profile_img}
					width={0}
					height={0}
					alt="profile image"
				/>
				{/* online status */}
				<div
					className={` ${online ? "bg-[#80FF00]" : "bg-[#C3C3C3]"} size-[15px] rounded-full absolute right-7 bottom-3`}
				></div>
			</div>
			<div className="ml-[220px]">
				<h1 className="font-semibold text-[32px] text-white">
					{user.first_name} {user.last_name}
				</h1>
				<div className="flex  gap-[20px] items-center">
					<h2 className="font-semibold text-[24px] text-white opacity-[54%]">
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
	);
}

export default ProfileInfo;
