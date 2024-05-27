"use client";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/app/logo.svg";
import { PopupEnternumber } from "../2Fa/Popup.jsx";
import { showPassword } from "../AuthTools/LoginRegisterTools";
import {
	IntraSvg,
	PasswordSvg,
	closeSvg,
	errorSvg,
	usernameInputSvg,
} from "../Allsvg";

import { get42Token, handel42, handleSubmit } from "./LoginUtils";
import Loading from "../Loading.jsx";

export function InputContainer({ Info, error }) {
	return (
		<div
			className={`w-[80%] bg-[#3F3A44] rounded-[5px] pt-[5px] flex  ${error ? "animate-shake border  border-red-600" : ""}`}
		>
			<label
				className={`absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px] ${error ? "text-red-600" : ""}`}
				htmlFor={Info.id}
			>
				{Info.label}
			</label>
			<input
				className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
				required
				type={Info.type}
				id={Info.id}
				placeholder=""
			/>
			{Info.Svg}
		</div>
	);
}

export function Error({ error }) {
	return (
		<div
			className={`${error ? "" : "hidden"} animate-shake bg-red-600 mx-[50px] my-[30px] w-[80%] h-[40px] rounded-[5px] flex justify-center items-center`}
		>
			{errorSvg}
			<span className="p-[5px] text-white  font-bold">{error?.msg}</span>
		</div>
	);
}

export default function Login() {
	const navigate = useRouter();

	const Form = useRef(null);
	const [error, setError] = useState();
	const [popUp2Fa, setPopUp2Fa] = useState();
	const [isLoading, setisLoading] = useState();
	// const [log42, setLog42] = useState();

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		let code = urlParams.get("code");

		if (code) {
			setisLoading(true);
			// setLog42(code)
			get42Token(navigate, code, setisLoading, setError);
		}
	}, []);

	return (
		<>
			{closeSvg(navigate)}

			<div className="flex items-center flex-col">
				<Image
					src={logo}
					className="[@media(max-width:450px)]:h-[100px]"
					alt=""
				/>
				<h1 className=" font-bold text-[60px] text-white [@media(max-width:450px)]:text-[40px] first-letter:text-[#0275A3]">
					Login
				</h1>
			</div>

			<Error error={error} />

			<form
				className="w-full flex flex-col justify-center items-center gap-[20px] mt-[20px]"
				onSubmit={(e) =>
					handleSubmit(
						e,
						Form,
						setError,
						setPopUp2Fa,
						navigate,
						setisLoading,
					)
				}
				ref={Form}
			>
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
						id: "password",
						type: "password",
						Svg: PasswordSvg(showPassword),
						label: "Enter your password",
					}}
					error={error?.type == "password"}
				/>

				<div className="w-[80%]">
					<input type="checkbox" id="rememberMe" name="rememberMe" />
					<label
						className="text-[#00B6FF]  ml-[5px]"
						htmlFor="rememberMe"
					>
						Remember me
					</label>
				</div>

				<button
					className="w-[80%] h-[45px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px]  cursor-pointer"
					type="submit"
				>
					Login
				</button>

				<button
					className="flex justify-center items-center w-[80%] h-[45px]  rounded-[5px] bg-[#A11872] cursor-pointer hover:bg-[#1791B2]"
					onClick={handel42}
				>
					{IntraSvg}
				</button>

				<div className="flex justify-center [@media(max-width:550px)]:grid [@media(max-width:550px)]:text-center">
					<span className=" font-bold text-[#8C8C8C] text-[20px]">
						What are you waiting For?
					</span>
					<Link
						className=" font-bold text-[#00B6FF] text-[18px] pl-[10px]"
						href="/register"
					>
						Create your account now
					</Link>
				</div>
			</form>
			{isLoading && <Loading />}
			{popUp2Fa && (
				<PopupEnternumber update={setPopUp2Fa} username={popUp2Fa} />
			)}
			{/* {log42 && <Login42 code={log42}/>} */}
		</>
	);
}
