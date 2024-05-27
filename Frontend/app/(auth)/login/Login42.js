import { useState } from "react";
import { usernameInputSvg } from "../Allsvg";
import { useRouter } from "next/navigation";
import { AUTH_42 } from "@/app/URLS";
import { Error } from "./page";
import { errorInForm } from "../AuthTools/LoginRegisterTools";
import { settoken } from "../AuthTools/tokenManagment";
import Loading from "../Loading";

export async function get42Token(
	navigate,
	username,
	code,
	setisLoading,
	setError,
) {
	setisLoading(true);
	let body = { code: code, identifier: username };
	try {
		const response = await fetch(AUTH_42, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (response.ok) {
			const tokens = await response.json();
			settoken(tokens);
			console.log("Login successful");
			navigate.replace("/home");
		} else {
			setisLoading(false);
			const detail = await response.json();
			if (detail?.duplicate)
				return errorInForm({ msg: detail.duplicate }, setError);
			errorInForm(
				{ type: "intra", msg: "Login with intra failed" },
				setError,
			);
			console.error("Login failed");
		}
	} catch (error) {
		setisLoading(false);
		console.error("Network error:", error);
	}
}

export function Login42({ code }) {
	const navigate = useRouter();

	const [isLoading, setisLoading] = useState();
	const [error, setError] = useState();
	const [username, setUsername] = useState();

	return (
		<div className="absolute z-[3] top-0 size-full flex justify-center items-center backdrop-blur-[5px]">
			<div className="w-[90%] h-[350px] flex flex-col justify-center items-center gap-[20px] bg-[#343434] rounded-[25px] shadow-[0_4px_40px_5px_rgba(0,0,0,0.7)] relative">
				<Error error={error} />

				<h1 className=" font-bold text-[20px] text-white [@media(max-width:460px)]:text-[16px]">
					Enter a Username
				</h1>
				<div
					className={`w-[300px] bg-[#3F3A44] rounded-[5px] pt-[5px] flex  ${error ? "animate-shake border  border-red-600" : ""}`}
				>
					<label
						className={`absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px] ${error ? "text-red-600" : ""}`}
					>
						Enter Username
					</label>
					<input
						className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px]"
						required
						type="text"
						placeholder=""
						onChange={(e) => setUsername(e.target.value)}
					/>
					{usernameInputSvg}
				</div>
				<button
					className="w-[300px] h-[45px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px]  cursor-pointer"
					type="submit"
					onClick={() =>
						get42Token(
							navigate,
							username,
							code,
							setisLoading,
							setError,
						)
					}
				>
					Login
				</button>
			</div>
			{isLoading && <Loading />}
		</div>
	);
}
