"use client";
import { useContext } from "react";
import Logo from "@/app/logo.svg";
import Links from "./Links.jsx";
import Image from "next/image";
import { UserContext } from "../context";

export default function SideBar(props) {
	const { setSettings } = useContext(UserContext);

	return (
		<div className="bg-[#353535] fixed w-[80px] h-full z-[1] [@media(max-width:900px)]:w-full [@media(max-width:900px)]:bottom-0 [@media(max-width:900px)]:h-[65px] [@media(max-width:900px)]:flex">
			<div className="flex justify-center mt-[20px] mb-[40px] [@media(max-width:900px)]:hidden">
				<Image
					className="size-[81px]"
					width={100}
					height={100}
					src={Logo}
					alt="icon"
					priority={true}
				/>
			</div>
			{/* <div className="h-10 w-full xs:bg-[#FF0000] sm:bg-[#FF6633] md:bg-[#FF9900] lg:bg-[#FFFF00] xl:bg-[#C2C2F0] 2xl:bg-[#E0E0E0]"></div> */}
			<div className="h-[30%] mt-[20px] [@media(max-width:900px)]:mt-0 [@media(max-width:900px)]:mx-[15px] [@media(max-width:900px)]:size-full [@media(max-width:900px)]:flex [@media(max-width:900px)]:transition [@media(max-width:900px)]:duration[2000ms]">
				<Links showSettings={setSettings} />
			</div>
		</div>
	);
}
