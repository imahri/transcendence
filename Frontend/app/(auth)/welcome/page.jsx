"use client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import logo from "../../logo.png";

// const google = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="11" height="19" viewBox="0 0 18 19" fill="none"><path d="M18 9.72218C18 15.1425 14.4258 19 9.14754 19C4.08689 19 0 14.7556 0 9.5C0 4.24436 4.08689 0 9.14754 0C11.6115 0 13.6844 0.938508 15.2816 2.48609L12.7918 4.97218C9.53484 1.70847 3.47828 4.16008 3.47828 9.5C3.47828 12.8135 6.02705 15.4988 9.14754 15.4988C12.7697 15.4988 14.127 12.802 14.341 11.4038H9.14754V8.13629H17.8561C17.941 8.62278 18 9.09012 18 9.72218Z" fill="white"/></svg>'

function Welcome() {
	const navigate = useRouter();

	function Tologin() {
		navigate.replace("/login");
	}
	function Toregister() {
		navigate.replace("/register");
	}

	return (
		<>
			<div className="flex items-center flex-col mb-0">
				<Image src={logo} alt="" className="max-[450px]:h-[100px]" />
				<h1 className="font-Chakra font-bold text-[60px] text-white max-[450px]:text-[40px]">
					Welcome to <br /> Paddel{" "}
					<span className="text-[#0275A3]">Ghost</span>
				</h1>
			</div>
			<button
				className="w-[80%] h-[45px] mx-[50px] my-[10px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px]  cursor-pointer "
				onClick={Tologin}
			>
				Sign In
			</button>
			<button
				className="w-[80%] h-[45px] mx-[50px] my-[10px] bg-[#1791B2] rounded-[5px] text-white font-bold text-[16px]  cursor-pointer "
				onClick={Toregister}
			>
				Sign Up
			</button>

			<div className="w-[80%] h-[45px]  mx-[50px] my-[25px] flex justify-between">
				<button className="w-[45%] rounded-[5px] bg-[#31377C] bg-contain bg-no-repeat bg-center cursor-pointer hover:bg-[#1791B2]"></button>
				<button className="w-[45%] rounded-[5px] bg-[#A11872] bg-contain bg-no-repeat bg-center cursor-pointer hover:bg-[#1791B2]"></button>
			</div>
		</>
	);
}

export default Welcome;
