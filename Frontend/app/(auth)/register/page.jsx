"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import logo from "@/app/logo.svg";
import {
	PasswordSvg,
	closeSvg,
	emailInputSvg,
	nameInputSvg,
	usernameInputSvg,
} from "../Allsvg";

import { showPassword } from "../AuthTools/LoginRegisterTools";
import { registerSubmit } from "./registerUtils";
import { Error, InputContainer } from "../login/page";

function DoubleInput({ Info, error }) {
	return (
		<div
			className={`bg-[#3F3A44] rounded-[5px] flex pt-[5px] [@media(max-width:592px)]:h-[50px] [@media(max-width:592px)]:mt-[30px] ${error ? "animate-shake border  border-red-600" : ""}`}
		>
			<label
				className="absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px]"
				htmlFor={Info.id}
			>
				{Info.label}
			</label>
			<input
				className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
				required
				type="text"
				id={Info.id}
				placeholder=""
			/>
			{nameInputSvg}
		</div>
	);
}

function Register() {
	const Form = useRef(null);
	const navigate = useRouter();

	const [error, setError] = useState();

	return (
		<>
			{closeSvg(navigate)}
			<div className="flex items-center flex-col mb-0">
				<Image
					src={logo}
					className="[@media(max-width:450px)]:h-[100px]"
					alt=""
				/>
				<h1 className=" font-bold text-[60px] text-white text-center [@media(max-width:450px)]:text-[40px]">
					Create <br /> new{" "}
					<span className="text-[#0275A3]">account</span>
				</h1>
			</div>

			<Error error={error} />

			<form
				onSubmit={(e) => registerSubmit(e, Form, setError, navigate)}
				ref={Form}
				className="w-full  flex flex-col justify-center items-center gap-[20px] mt-[20px]"
			>
				<div className="w-[80%] h-[55px] flex justify-between [@media(max-width:592px)]:h-auto [@media(max-width:592px)]:block">
					<DoubleInput
						Info={{
							id: "firstname",
							label: "Enter your firstname",
						}}
						error={error?.type == "first_name"}
					/>
					<DoubleInput
						Info={{ id: "lastname", label: "Enter your lastname" }}
						error={error?.type == "last_name"}
					/>
				</div>

				<InputContainer
					Info={{
						id: "username",
						type: "text",
						Svg: usernameInputSvg,
						label: "Enter your username",
					}}
					error={error?.type == "username"}
				/>
				<InputContainer
					Info={{
						type: "text",
						id: "email",
						label: "Enter your Email",
						Svg: emailInputSvg,
					}}
					error={error?.type == "email"}
				/>
				<InputContainer
					Info={{
						id: "password",
						type: "password",
						Svg: PasswordSvg(showPassword),
						label: "Enter your password",
					}}
					error={error?.type == "password"}
				/>

				<button
					className="w-[80%] h-[45px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px]  cursor-pointer"
					type="submit"
				>
					Submit
				</button>

				<div className="flex justify-center [@media(max-width:550px)]:grid [@media(max-width:550px)]:text-center">
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
