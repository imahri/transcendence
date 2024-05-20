"use client";
import { useState } from "react";
import Image from "next/image";

function PlusSvg(setCreate) {
	return (
		<svg
			onClick={() => {
				setCreate((prev) => !prev);
			}}
			className="cursor-pointer"
			width="25"
			height="25"
			viewBox="0 0 30 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M15 0C6.71371 0 0 6.71371 0 15C0 23.2863 6.71371 30 15 30C23.2863 30 30 23.2863 30 15C30 6.71371 23.2863 0 15 0ZM23.7097 16.6935C23.7097 17.0927 23.3831 17.4194 22.9839 17.4194H17.4194V22.9839C17.4194 23.3831 17.0927 23.7097 16.6935 23.7097H13.3065C12.9073 23.7097 12.5806 23.3831 12.5806 22.9839V17.4194H7.01613C6.61694 17.4194 6.29032 17.0927 6.29032 16.6935V13.3065C6.29032 12.9073 6.61694 12.5806 7.01613 12.5806H12.5806V7.01613C12.5806 6.61694 12.9073 6.29032 13.3065 6.29032H16.6935C17.0927 6.29032 17.4194 6.61694 17.4194 7.01613V12.5806H22.9839C23.3831 12.5806 23.7097 12.9073 23.7097 13.3065V16.6935Z"
				fill="#878787"
			/>
		</svg>
	);
}

import profile from "./assets/profile.png";
const tr = [
	{ name: "first", owner: profile, nb: "5" },
	{ name: "first", owner: profile, nb: "5" },
	{ name: "first", owner: profile, nb: "5" },
	{ name: "first", owner: profile, nb: "5" },
	{ name: "first", owner: profile, nb: "5" },
	{ name: "first", owner: profile, nb: "5" },
	{ name: "first", owner: profile, nb: "5" },
];

function Display({ obj }) {
	return (
		<div className="w-full flex justify-between items-center gap-[10px] h-[50px]">
			<div className="w-[80%] cursor-pointer h-full flex justify-between items-center">
				<h1 className="font-bold text-[17px] text-[#cccccc]">
					{obj.name}
				</h1>
				<h1 className="font-bold text-[17px] text-[#cccccc]">
					{obj.nb}/8
				</h1>
			</div>
			<Image
				className="size-[40px] cursor-pointer rounded-full"
				src={obj.owner}
				alt="Tournamnt owner"
			/>
		</div>
	);
}

function Input({ label, setter, error }) {
	return (
		<div
			className={`${error ? "animate-shake" : ""} w-[80%] h-[55px]  bg-[#343434] rounded-[5px] pt-[5px] flex`}
		>
			<label
				className={`absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px]`}
			>
				{label}
			</label>
			<input
				className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
				type="text"
				onChange={(e) => {
					setter(e.currentTarget.value);
				}}
			/>
		</div>
	);
}

function myseterror(setError, error) {
	setError(error);
	setTimeout(() => {
		setError(false);
	}, 5000);
}

function handleCreate(username, Tournament, setError) {
	if (!Tournament) {
		myseterror(setError, "tournament");
		return;
	}
	// send username and Tournament to backend
}

function Create() {
	const [username, setUsername] = useState();
	const [Tournament, setTournament] = useState();
	const [error, setError] = useState();

	return (
		<div className="size-full flex flex-col items-center justify-center gap-[20px] p-[20px] ">
			<h1 className="text-white text-opacity-40 font-semibold text-[20px]">
				Creat Tournament
			</h1>

			<Input
				label={"Enter Tournament Name"}
				error={error == "tournament"}
				setter={setTournament}
			/>
			<Input
				label={"Enter Username"}
				error={error == "username"}
				setter={setUsername}
			/>
			<button
				className="w-[138px] h-[37px] bg-green-500 bg-opacity-70 rounded-[10px]  font-bold text-[16px] cursor-pointer text-white relative"
				onClick={() => handleCreate(username, Tournament, setError)}
			>
				Create
			</button>
		</div>
	);
}

function searchTournament(e, setResult, setCreate) {
	setCreate(false);
	const input = e.target.value;
	if (!input) {
		setResult(false);
		return;
	}
	setResult(tr);
}

function page() {
	const [create, setCreate] = useState();
	const [searchResult, setResult] = useState();

	return (
		<div className="absolute py-[30px] [@media(max-width:570px)]:w-[90%] w-[500px] min-h-[530px] bg-gradient-to-b from-[#343434] via-[rgba(52,52,52,0.398496)] to-[#343434] shadow-[0_4px_40px_5px_rgba(0,0,0,0.7)] flex flex-col items-center gap-[20px] rounded-md">
			<h1 className="text-white text-opacity-40 font-semibold text-[20px]">
				Search Tournament or Creat it
			</h1>
			<div className="bg-[#252525] rounded-md p-[10px] w-[70%] h-[50px] flex items-center justify-between">
				<input
					type="text"
					className="bg-transparent h-full focus:outline-none font-bold text-[17px] text-[#cccccc] placeholder:text-[#cccccc] placeholder:cursor-default"
					placeholder="Search Tournament"
					onChange={(e) => {
						searchTournament(e, setResult, setCreate);
					}}
				/>
				{PlusSvg(setCreate)}
			</div>
			<div
				className={`${!create && !searchResult ? "hidden" : ""} bg-[#252525] w-[70%] h-[350px] p-[10px] rounded-lg `}
			>
				<div
					className={`${searchResult && !create ? "" : "hidden"} flex flex-col items-center gap-[20px] overflow-y-scroll size-full`}
				>
					{searchResult &&
						searchResult.map((obj, index) => {
							return (
								<div className="w-full pr-[10px]" key={index}>
									<Display obj={obj} />
								</div>
							);
						})}
				</div>
				{create && <Create />}
			</div>
		</div>
	);
}

export default page;
