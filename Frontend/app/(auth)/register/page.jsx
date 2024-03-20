"use client";

import React, { useRef, useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import logo from "../../logo.png";
import {
	PasswordSvg,
	closeSvg,
	emailInputSvg,
	errorSvg,
	nameInputSvg,
} from "../Allsvg";

import { showPassword } from "../AuthTools/LoginRegisterTools";
import { registerSubmit } from "./registerUtils";

function Register() {
	const Form = useRef(null);
	const navigate = useRouter();

	const [error, setError] = useState();
	const [errorPassword, setErrorPassword] = useState();
	const [errorLastname, setErrorLastname] = useState();
	const [errorFirstame, setErrorFirstname] = useState();
	const [errorEmail, setErrorEmail] = useState();

	return (
		<>
			{closeSvg(navigate)}
			<div className="flex items-center flex-col mb-0">
				<Image src={logo} className="max-[450px]:h-[100px]" alt="" />
				<h1 className=" font-bold text-[60px] text-white text-center max-[450px]:text-[40px]">
					Create <br /> new{" "}
					<span className="text-[#0275A3]">account</span>
				</h1>
			</div>
			<div
				className={
					error
						? "animate-shake bg-red-600 mx-[50px] w-[80%] h-[40px] rounded-[5px] flex justify-center items-center"
						: "hidden"
				}
			>
				{errorSvg}
				<span className="p-[5px] text-white">Error in Login Form!</span>
			</div>

			<form
				onSubmit={(e) => registerSubmit(e, Form, navigate)}
				ref={Form}
				className="w-full"
			>
				<div className="w-[80%] h-[55px] my-[30px] mx-[50px] flex justify-between max-[592px]:h-auto max-[592px]:block">
					<div
						className={`bg-[#3F3A44] rounded-[5px] flex pt-[5px] max-[592px]:h-[50px] max-[592px]:mt-[30px] ${errorFirstame ? "animate-shake border  border-red-600" : ""}`}
					>
						<label
							className="absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px]"
							htmlFor="firstname"
						>
							Enter your firstname
						</label>
						<input
							className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
							required
							type="text"
							id="firstname"
							placeholder=""
						/>

						{nameInputSvg}
					</div>

					<div
						className={`bg-[#3F3A44] rounded-[5px] flex pt-[5px] max-[592px]:h-[50px] max-[592px]:mt-[30px] ${errorLastname ? "animate-shake border  border-red-600" : ""}`}
					>
						<label
							className="absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px]"
							htmlFor="lastname"
						>
							Enter your lastname
						</label>
						<input
							className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
							required
							type="text"
							id="lastname"
							placeholder=""
						/>
						{nameInputSvg}
					</div>
				</div>
				<div
					className={`w-[80%] bg-[#3F3A44] rounded-[5px] pt-[5px] my-[30px] mx-[50px] flex ${errorEmail ? "animate-shake border  border-red-600" : ""}`}
				>
					<label
						className="absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px]"
						htmlFor="email"
					>
						Enter your Email
					</label>
					<input
						className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
						required
						type="text"
						id="email"
						placeholder=""
					/>
					{emailInputSvg}
				</div>
				<div
					className={`w-[80%] bg-[#3F3A44] rounded-[5px] pt-[5px] my-[30px] mx-[50px] flex ${errorPassword ? "animate-shake border  border-red-600" : ""}`}
				>
					<label
						className="absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px]"
						htmlFor="password"
					>
						Enter password
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
				<button
					className="w-[80%] h-[45px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px]  cursor-pointer mx-[50px] my-[10px]"
					type="submit"
				>
					Submit
				</button>

				<div className="flex justify-center my-[20px] mx-[50px] max-[550px]:grid max-[550px]:text-center">
					<span className=" font-bold text-[#8C8C8C] text-[20px]">
						Already Member?
					</span>
					<Link
						className=" font-bold text-[#00B6FF] text-[18px] pl-[10px]"
						href="/login"
					>
						Log In
					</Link>
				</div>
			</form>
		</>
	);
}

export default Register;
