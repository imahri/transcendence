"use client";
import React, { useContext, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import logo from "../../logo.png";

import { PopupEnternumber } from "../2Fa/Popup.jsx";
import { showPassword } from "../AuthTools/LoginRegisterTools";

let navigate;

import { PasswordSvg, closeSvg, errorSvg, usernameInputSvg } from "../Allsvg";

import { handleSubmit } from "./LoginUtils";

export default function Login() {
	navigate = useRouter();

	const Form = useRef(null);
	const [error, setError] = useState();
	const [errorPassword, setErrorPassword] = useState();
	const [errorUsername, setErrorUsername] = useState();
	const [popUp2Fa, setPopUp2Fa] = useState();

	// const { user, setUser } = useContext(UserContext);

	const setUser = (user) => {
		console.log(user);
	};

	return (
		<>
			{closeSvg(navigate)}

			<div className="flex items-center flex-col mb-0">
				<Image src={logo} className="max-[450px]:h-[100px]" alt="" />
				<h1 className="font-Chakra font-bold text-[60px] text-white max-[450px]:text-[40px] first-letter:text-[#0275A3]">
					Login
				</h1>
			</div>
			<div
				className={
					error
						? "animate-shake bg-red-600 mx-[50px] my-[30px] w-[80%] h-[40px] rounded-[5px] flex justify-center items-center"
						: "hidden"
				}
			>
				{errorSvg}
				<span className="p-[5px] text-white font-Chakra font-bold">
					Error in Login Form!
				</span>
			</div>
			<form
				className="w-full"
				onSubmit={(e) =>
					handleSubmit(
						e,
						Form,
						setErrorUsername,
						setError,
						setErrorPassword,
						setPopUp2Fa,
						setUser,
						navigate,
					)
				}
				ref={Form}
			>
				<div
					className={`w-[80%] bg-[#3F3A44] rounded-[5px] pt-[5px] mx-[50px] my-[30px] flex  ${errorUsername ? "animate-shake border  border-red-600" : ""}`}
				>
					<label
						className={`absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px] ${errorUsername ? "text-red-600" : ""}`}
						htmlFor="username"
					>
						Enter your username
					</label>
					<input
						className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
						required
						type="text"
						id="username"
						placeholder=""
					/>
					{usernameInputSvg}
				</div>

				<div
					className={`w-[80%] bg-[#3F3A44] rounded-[5px] pt-[5px] my-[30px] mx-[50px] flex ${errorPassword ? "animate-shake border  border-red-600" : ""}`}
				>
					<label
						className={`absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px] ${errorUsername ? "text-red-600" : ""}`}
						htmlFor="password"
					>
						Enter your Password
					</label>
					<input
						className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
						required
						type="password"
						id="password"
						placeholder=""
					/>

					{PasswordSvg(showPassword)}
				</div>
				<div className="my-[10px] mx-[60px]">
					<input type="checkbox" id="rememberMe" name="rememberMe" />
					<label
						className="text-[#00B6FF] font-Chakra ml-[5px]"
						htmlFor="rememberMe"
					>
						Remember me
					</label>
				</div>
				<button
					className="w-[80%] h-[45px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px]  cursor-pointer mx-[50px] my-[10px]"
					type="submit"
				>
					Submit
				</button>
				<div className="w-[80%] h-[45px] flex justify-between my-[25px] mx-[50px]">
					<button
						id="google-signin-button"
						className="w-[45%] rounded-[5px] bg-[#31377C] bg-contain bg-no-repeat bg-center cursor-pointer hover:bg-[#1791B2]"
					></button>
					<button className="w-[45%] rounded-[5px] bg-[#A11872] bg-contain bg-no-repeat bg-center cursor-pointer hover:bg-[#1791B2]"></button>
				</div>
				<div className="flex justify-center my-[20px] mx-[50px] max-[550px]:grid max-[550px]:text-center">
					<span className="font-Chakra font-bold text-[#8C8C8C] text-[20px]">
						What are you waiting For?
					</span>
					<Link
						className="font-Chakra font-bold text-[#00B6FF] text-[18px] pl-[10px]"
						href="/register"
					>
						Create your account now
					</Link>
				</div>
			</form>
			{popUp2Fa && (
				<PopupEnternumber update={setPopUp2Fa} username={popUp2Fa} />
			)}
		</>
	);
}
