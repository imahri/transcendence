import Image from "next/image";
import { useState, useEffect } from "react";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";

function updateStatus(e, setStatus) {
	const data = JSON.parse(e.data);
	console.log("Received message:", data);
	setStatus(data.status);
}

function getStatus(socket, setStatus, friend_id) {
	socket.send(
		JSON.stringify({
			action: "check",
			friend_id: friend_id,
		}),
	);
}

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

	useEffect(() => {
		try {
			const token = getToken();
			const ws = new WebSocket(
				`ws://localhost:8000/ws/user?token=${token}`,
			);
			setSocket(ws);

			ws.onopen = () => {
				getStatus(ws, setStatus, profileUser.id);
			};

			ws.onmessage = (e) => {
				updateStatus(e, setStatus);
			};

			ws.onerror = (error) => {
				console.error("WebSocket error:", error);
			};
			ws.onclose = (event) => {
				console.log("WebSocket connection closed:", event.reason);
			};
		} catch (error) {
			console.error("Error creating WebSocket:", error);
		}
		return () => {
			if (socket) socket.close();
		};
	}, []);

	return (
		<div className="flex flex-col gap-[10px] ">
			{status == "owner" && <Button action={"Edit"} color={"#3D9D5E"} />}
			{status == "not friend" && (
				<Button
					action={"Add Friend"}
					socket={socket}
					friend_id={profileUser.id}
					color={"bg-green-600"}
				/>
			)}

			{status == "B" && (
				<>
					<Button
						action={"Blocked"}
						socket={socket}
						friend_id={profileUser.id}
						color={"bg-gray-600"}
					/>
					<Button
						action={"Unblock"}
						socket={socket}
						friend_id={profileUser.id}
						color={"bg-green-600"}
					/>
				</>
			)}

			{status == "W" && (
				<>
					<Button
						action={"remove Request"}
						socket={socket}
						friend_id={profileUser.id}
						color={"bg-red-600"}
					/>
				</>
			)}
			{status == "I" && (
				<>
					<Button
						action={"Accept"}
						socket={socket}
						friend_id={profileUser.id}
						color={"bg-green-600"}
					/>
					<Button
						action={"Reject"}
						socket={socket}
						friend_id={profileUser.id}
						color={"bg-red-600"}
					/>
				</>
			)}
			{status == "F" && (
				<>
					<Button
						action={"Remove Friend"}
						socket={socket}
						friend_id={profileUser.id}
						color={"bg-red-600"}
					/>
					<Button
						action={"block"}
						socket={socket}
						friend_id={profileUser.id}
						color={"bg-gray-600"}
					/>
				</>
			)}
			{status == "BY" && (
				<>
					<Button
						action={"User Blocked You"}
						socket={socket}
						friend_id={profileUser.id}
						color={"bg-red-600"}
					/>
				</>
			)}
		</div>
	);
}

function ProfileInfo({ user }) {
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
				<h2 className="font-semibold text-[24px] text-[#ABABAB] ">
					{" "}
					Level {user.info.level}
				</h2>
			</div>
			<Buttons profileUser={user} />
		</div>
	);
}

export default ProfileInfo;
