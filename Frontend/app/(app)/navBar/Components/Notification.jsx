"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChatSvg, GmaeSvg, FriendSvg, AccepSvg, DeclineSvg } from "./AllSvg";
import { UserContext } from "../../context";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { IMAGE_URL, NOTIF_URL } from "@/app/URLS";
import {
	accept,
	calculateTimeDifference,
	decline,
	getNotifLink,
	readNotif,
	setType,
} from "./NotifUtils";

function acceptDecline(callBack, svg) {
	return (
		<button
			onClick={callBack}
			className="size-[20px] rounded-full cursor-pointer flex justify-center items-center"
		>
			{svg}
		</button>
	);
}

function AcceptDeclineGame({ notif, ws }) {
	//send friend id to endpoint and send notif to user inform it friend accept your invit
	// if decline send notif to other user user decline
	return (
		<div className="flex justify-between items-center gap-[5px]">
			{acceptDecline(() => accept(notif), AccepSvg)}
			{acceptDecline(() => decline(ws, notif), DeclineSvg)}
		</div>
	);
}

function NotifSection({ notif, ws }) {
	const { user } = useContext(UserContext);
	const ntype = notif.type;
	const Svg = ntype == "C" ? ChatSvg : ntype == "F" ? FriendSvg : GmaeSvg;
	const type = setType(notif.type, notif.content, user.username);
	const link = getNotifLink(notif);
	const time = calculateTimeDifference(notif.time);

	return (
		<Link
			href={link}
			className="w-full h-[70px] flex items-center gap-[10px] relative"
		>
			<div className="relative">
				<Image
					className="size-[50px] rounded-full ml-[5px]"
					width={50}
					height={50}
					src={`${IMAGE_URL}?path=${notif.user.img}`}
					alt="sender Image"
				/>
				{Svg}
			</div>
			<div>
				<h1 className="text-white font-bold text-[15px]">
					{notif.user.username}
				</h1>
				<div className="flex w-full gap-[8px]">
					<h2 className="text-[#7D7D7D] text-[13px]">{type}</h2>
					{!notif.is_read &&
						ntype == "G" &&
						notif.content?.type == "invit" && (
							<AcceptDeclineGame notif={notif} ws={ws} />
						)}
				</div>
				<h2 className="text-[#7D7D7D] text-[10px]">{time}</h2>
			</div>
			<div
				className={`absolute size-[10px] bg-greatBlue rounded-full right-[15px] ${notif.is_read || notif.content?.type == "invit" ? "hidden" : ""}`}
			></div>
		</Link>
	);
}

async function getNotif(setNotif, setNbNotif) {
	const [isOk, status, data] = await fetch_jwt(NOTIF_URL);
	if (isOk) {
		setNbNotif(data.nb_unreaded);
		setNotif(data.allNotif);
		return;
	}
	console.log("error fetch notif", data);
}

function handelNotif(data, setNotif, setNbNotif) {
	if (data.content.type == "T") console.log(data.content);
	setNotif((prev) => {
		if (prev) {
			prev.unshift(data.content);
			return prev;
		} else return data.content;
	});
	setNbNotif((prev) => prev + 1);
}

function Notification() {
	const [notif, setNotif] = useState(false);
	const [active, setactive] = useState();
	const [nbNotif, setnbNotif] = useState();

	const { ws } = useContext(UserContext);

	useEffect(() => {
		if (!notif) {
			getNotif(setNotif, setnbNotif);
		}

		if (ws) {
			ws.addEventListener("message", (e) => {
				const data = JSON.parse(e.data);
				if (data.type == "notification")
					handelNotif(data, setNotif, setnbNotif);
			});
		}
	}, [ws]);

	return (
		<div className="relative">
			<svg
				onClick={() => {
					setactive(!active);
				}}
				className="cursor-pointer"
				width="30"
				height="30"
				viewBox="0 0 34 42"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16.6667 0C14.9417 0 13.5417 1.4 13.5417 3.125V4.57357C8.15247 5.9627 4.16667 10.8433 4.16667 16.6667V29.1667L0.968425 31.5755H0.964355C0.668736 31.7638 0.42538 32.0235 0.256814 32.3308C0.0882469 32.6381 -8.31377e-05 32.9829 5.87164e-08 33.3333C5.87164e-08 33.8859 0.219494 34.4158 0.610195 34.8065C1.0009 35.1972 1.5308 35.4167 2.08333 35.4167H16.6667H31.25C31.8025 35.4167 32.3324 35.1972 32.7231 34.8065C33.1138 34.4158 33.3333 33.8859 33.3333 33.3333C33.3334 32.9829 33.2451 32.6381 33.0765 32.3308C32.908 32.0235 32.6646 31.7638 32.369 31.5755L29.1667 29.1667V16.6667C29.1667 10.8433 25.1809 5.9627 19.7917 4.57357V3.125C19.7917 1.4 18.3917 0 16.6667 0ZM12.5 37.5C12.5 39.7917 14.375 41.6667 16.6667 41.6667C18.9583 41.6667 20.8333 39.7917 20.8333 37.5H12.5Z"
					fill="#B7B7B7"
				/>
			</svg>
			<div className="size-5 bg-greatBlue rounded-full absolute top-[-2px] left-4 flex justify-center items-center">
				<span className="text-white text-[13px]">{nbNotif}</span>
			</div>
			<div
				className={`w-[300px] bg-[#303030] absolute right-[5px] top-[35px] rounded-b-[20px] flex flex-col gap-[10px] ${active ? "" : "hidden"}`}
			>
				<div className="flex justify-center items-center h-[40px] bg-greatBlue">
					<h1 className="text-white font-semibold"> Notification</h1>
				</div>
				<div className="max-h-[300px] mb-[20px] overflow-y-auto flex flex-col gap-[5px] pl-[5px]">
					{notif &&
						notif
							.sort((a, b) => new Date(b.time) - new Date(a.time))
							.map((notif, index) => {
								return (
									<div
										onClick={() =>
											readNotif(ws, notif, setnbNotif)
										}
										key={index}
									>
										<NotifSection notif={notif} ws={ws} />
									</div>
								);
							})}
					{notif?.length == 0 && (
						<h1 className="text-white text-center">
							No Notification
						</h1>
					)}
				</div>
			</div>
		</div>
	);
}

export default Notification;
