"use client";
import { useState } from "react";
import MyCollection from "./MyCollection";
import MyState from "./MyState";
import { useRouter, useSearchParams } from "next/navigation";

function SkinTitle(active, setActive, title, router) {
	const color = active ? "text-white" : "text-[#979797]";
	const font = active ? "font-semibold" : "font-normal";
	return (
		<h1
			className={`font-Chakra  ${font} text-[24px] ${color} flex flex-col items-center cursor-pointer`}
			onClick={() =>
				setActive(() => {
					router.push(`?active=${title}`);
					return title;
				})
			}
		>
			{title}
			<div
				className={`${!active ? "hidden" : ""} animate-pop w-[40px] h-[2px] bg-[#DB00FF]`}
			></div>
		</h1>
	);
}

function Dashboard() {
	const Params = useSearchParams();
	const ActiveQuery = Params.get("active");
	const [active, setActive] = useState(ActiveQuery ? ActiveQuery : "State");
	const router = useRouter();

	return (
		<div className="w-full min-h-[750px] my-[10px] flex flex-col gap-[20px]">
			<div className="flex gap-[70px] mt-[30px] ml-[60px]">
				{SkinTitle(active == "State", setActive, "State", router)}
				{SkinTitle(active == "Skin", setActive, "Skin", router)}
			</div>

			<div className="w-full flex justify-center">
				{active == "Skin" && <MyCollection />}
				{active == "State" && <MyState />}
			</div>
		</div>
	);
}

export default Dashboard;
