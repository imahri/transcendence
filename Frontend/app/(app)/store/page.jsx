"use client";
import { useState } from "react";
import Storelogo from "./assets/storeLogo.png";
import Title from "./assets/title.png";
import Padlles from "./Components/Padlles";
import Boards from "./Components/Boards";
import Badges from "./Components/Badges";
import NavBar from "../navBar/NavBar.jsx";
import Image from "next/image";
import { errorSvg } from "@/app/(auth)/Allsvg";

function Section({ title, children }) {
	return (
		<div className="w-[90%] bg-[#353535] opacity-[63%] p-[10px] rounded-[10px] flex flex-col items-center relative">
			<h1 className="text-[30px] text-white font-medium">{title}</h1>
			<div
				className={`${title == "Paddle" ? "h-[200px]" : "h-[280px]"} w-full flex items-center overflow-x-scroll`}
			>
				{children}
			</div>
		</div>
	);
}

function Store() {
	const [error, setError] = useState();

	return (
		<>
			<NavBar />

			<div className="w-full mt-[90px] mb-[10px] [@media(max-width:900px)]:mb-[90px] flex flex-col items-center gap-[25px]">
				<div className="w-[90%] bg-opacity-[63%] rounded-[10px] flex flex-col items-center justify-between gap-[10px] relative">
					<div className="bg-[#190019] flex justify-around w-[50%] rounded-[22px] [@media(max-width:1155px)]:w-full">
						<Image
							className="rounded-[22px] [@media(max-width:580px)]:h-[100px] [@media(max-width:428px)]:h-[80px]"
							src={Title}
							alt=""
						/>
						<Image
							className="rounded-[22px] [@media(max-width:580px)]:size-[100px] [@media(max-width:428px)]:w-[80px] [@media(max-width:428px)]:h-[80px]"
							src={Storelogo}
							alt=""
						/>
					</div>
					<div
						className={`${error ? "" : "hidden"} animate-shake bg-red-600 min-w-[500px] h-[40px] rounded-[5px] flex justify-center items-center`}
					>
						{errorSvg}
						<span className="p-[5px] text-white  font-bold">
							Error : {error}
						</span>
					</div>
				</div>

				<Section title={"Paddle"}>
					<Padlles setError={setError} />
				</Section>
				<Section title={"Board"}>
					<Boards setError={setError} />
				</Section>
				<Section title={"Badge"}>
					<Badges setError={setError} />
				</Section>
			</div>
		</>
	);
}

export default Store;
