"use client";
import { useState } from "react";
import profile from "./assets/profile.png";
import Create from "./components/CreateTournament";
import Display from "./components/Display";

function PlusSvg(setCreate, setDemo) {
	return (
		<svg
			onClick={() => {
				setCreate((prev) => !prev);
				setDemo(false);
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

const user = { img: profile, name: "ok" };
const users = [user, user, user, user, user, user, user, user];
const tr = [
	{ name: "first", owner: profile, nb: "8", users },
	{ name: "first", owner: profile, nb: "5", users },
	{ name: "first", owner: profile, nb: "5", users },
	{ name: "first", owner: profile, nb: "5", users },
	{ name: "first", owner: profile, nb: "5", users },
	{ name: "first", owner: profile, nb: "5", users },
	{ name: "first", owner: profile, nb: "5", users },
];

function searchTournament(e, setResult, setCreate, setDemo) {
	setCreate(false);
	setDemo(false);
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
	const [demo, setDemo] = useState();

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
						searchTournament(e, setResult, setCreate, setDemo);
					}}
				/>
				{PlusSvg(setCreate, setDemo)}
			</div>
			<div
				className={`${!create && !searchResult && !demo ? "hidden" : ""} bg-[#252525] w-[70%] min-h-[350px] p-[10px] rounded-lg`}
			>
				<div
					className={`${searchResult && !create ? "" : "hidden"} flex flex-col items-center gap-[20px] overflow-y-scroll w-full h-[340px]`}
				>
					{searchResult &&
						searchResult.map((obj, index) => {
							return (
								<div className="w-full pr-[10px]" key={index}>
									<Display
										obj={obj}
										setResult={setResult}
										setDemo={setDemo}
									/>
								</div>
							);
						})}
				</div>
				{create && <Create />}
				{demo && <Demo Tournament={demo} />}
			</div>
		</div>
	);
}

export default page;
