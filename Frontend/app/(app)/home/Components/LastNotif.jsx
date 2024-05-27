"use client";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NoConv_icon from "../assets/no_conv.svg";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { MSGNOTIF_URL } from "@/app/URLS";
import Loading from "@/app/(auth)/Loading";
import { UserContext } from "../../context";
import { calculateTimeDifference } from "../../navBar/Components/Notification";

function Msg({ msg }) {
	const time = calculateTimeDifference(msg.time);

	return (
		<div className="flex items-center gap-[10px] relative border-b-[1px] border-solid border-b-[#707070] border-l-0 border-r-0 border-t-0 pb-[10px]">
			<Image
				className="size-[39px] rounded-full"
				width={39}
				height={39}
				src={msg.user.img}
				alt="sender image"
			/>
			<div>
				<h2 className=" font-normal text-[13px] text-white">
					{msg.user.username}
				</h2>
				<h3 className=" font-normal text-[10px] max-w-[200px] overflow-hidden  text-[#C3C3C3]">
					{msg.content.msg}
				</h3>
			</div>
			<div className="absolute right-[10px] flex flex-col justify-center items-center">
				<h3 className=" font-normal text-[10px] text-[#C3C3C3]">
					{time}
				</h3>
			</div>
		</div>
	);
}

function NoMsg() {
	return (
		<div className="size-full flex flex-col justify-center items-center">
			<Image
				width={100}
				height={100}
				src={NoConv_icon}
				alt="no conv icon"
			/>
			<p className="text-[#C3C3C3]">No Message</p>
		</div>
	);
}

async function getLastMsgs(setMsgs, setLoading) {
	try {
		const [isOk, status, data] = await fetch_jwt(MSGNOTIF_URL);

		if (!isOk) {
			setLoading(false);
			console.log(data);
			return;
		}
		setMsgs(data);
		setLoading(false);
	} catch (error) {
		console.log("last msgs : ", error);
	}
	setLoading(false);
}

function LastNotif() {
	const [Msgs, setMsgs] = useState();
	const [isLoading, setLoading] = useState(true);
	const { ws } = useContext(UserContext);

	useEffect(() => {
		getLastMsgs(setMsgs, setLoading);
	}, []);

	const newMsg = (e) => {
		const data = JSON.parse(e.data);
		if (data.type == "notification") {
			setMsgs((prev) => {
				return [...prev, data.content];
			});
		}
	};
	useEffect(() => {
		if (!ws) return;

		ws.addEventListener("message", newMsg);

		return () => {
			ws.removeEventListener("message", newMsg);
		};
	}, [ws]);

	return (
		<div className="bg-[#353535] py-[15px] w-[50%] rounded-[15px] flex flex-col items-center gap-[10px] [@media(max-width:710px)]:w-[90%]">
			<div className="flex items-center justify-between w-[60%] [@media(max-width:1990px)]:w-[80%]">
				<h1 className="font-normal text-[18px] text-[#C3C3C3]">
					Message
				</h1>
				<Link
					href={"/chat"}
					className=" font-light text-[18px] text-white text-center border-none rounded-[5px] bg-greatBlue w-[44px] h-[29px] cursor-pointer "
				>
					Go
				</Link>
			</div>
			<div className=" flex flex-col gap-[15px]  w-[60%] [@media(max-width:1990px)]:w-[80%]">
				<h3 className=" font-extralight text-[12px] text-[#C3C3C3]">
					Last Notification
				</h3>
				<div className="flex flex-col gap-[20px] h-[250px] overflow-y-auto pr-[10px] relative">
					{isLoading && <Loading />}
					{!Msgs && !isLoading && <NoMsg />}
					{Msgs &&
						Msgs.sort(
							(a, b) => new Date(b.time) - new Date(a.time),
						).map((msg, index) => {
							return (
								<div key={index}>
									<Msg msg={msg} />
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}

export default LastNotif;
