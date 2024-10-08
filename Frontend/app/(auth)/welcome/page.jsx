"use client";

import Image from "next/image";
import logo from "@/app/logo.svg";
import Link from "next/link";
import { IntraSvg } from "../Allsvg";
import { handel42 } from "../login/LoginUtils";

function Welcome() {
	return (
		<div className="w-full flex flex-col justify-center items-center gap-[20px]">
			<div className="flex items-center flex-col">
				<Image
					src={logo}
					alt=""
					className="[@media(max-width:450px)]:h-[100px]"
				/>
				<h1 className=" font-bold text-[60px] text-white [@media(max-width:450px)]:text-[40px]">
					Welcome to <br /> Paddel{" "}
					<span className="text-[#0275A3]">Ghost</span>
				</h1>
			</div>

			<Link
				className="flex justify-center items-center w-[80%] h-[45px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px] cursor-pointer "
				href={"/login"}
			>
				Sign In
			</Link>
			<Link
				className="flex justify-center items-center w-[80%] h-[45px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px] cursor-pointer "
				href={"/register"}
			>
				Sign Up
			</Link>

			<button
				className="flex justify-center items-center w-[80%] h-[45px] rounded-[5px] bg-[#A11872] cursor-pointer hover:bg-[#1791B2]"
				onClick={handel42}
			>
				{IntraSvg}
			</button>
		</div>
	);
}

export default Welcome;
