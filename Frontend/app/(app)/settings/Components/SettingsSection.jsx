import { useState } from "react";
import { useRouter } from "next/navigation";
import Security from "./Security";
import { logout } from "./SettingsUtils.js";

import { AccountSvg, AboutSvg, SecuritySvg, LogoutSvg } from "./Icons";
import { closePopopupSvg } from "@/app/(auth)/2Fa/Popup";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { USER_URL } from "@/app/URLS";
import { removeTokens } from "@/app/(auth)/AuthTools/tokenManagment";

function deleteAccount(password, navigate) {
	if (!password || password < 9) return;
	const bodyData = JSON.stringify({ password: password });

	fetch_jwt(
		USER_URL,
		{},
		{
			method: "DELETE",
			body: bodyData,
			headers: { "Content-Type": "application/json" },
		},
	).then(([isOk, status, data]) => {
		if (isOk) {
			removeTokens();
			navigate.replace("/welcome");
		}
	});
}

function DeleteComponent() {
	const [password, setPassword] = useState();
	const navigate = useRouter();

	return (
		<div className="w-full flex flex-col justify-center items-center gap-[10px] mb-[20px]">
			<h2 className="text-[#C0BBBB] font-bold text-[17px]">
				Enter Your password
			</h2>
			<input
				onChange={(e) => setPassword(e.target.value)}
				className="w-[295px] [@media(max-width:550px)]:w-[90%] h-[50px] rounded-[10px] bg-[#D9D9D9] pt-[2px] focus:outline-none text-white text-[30px] pl-[10px]"
				required
				type="password"
				id="password"
				placeholder=""
			/>

			<button
				className="w-[138px] h-[37px] bg-green-500 rounded-[10px] font-bold text-[16px] text-white cursor-pointer"
				onClick={() => {
					deleteAccount(password, navigate);
				}}
			>
				Delete
			</button>
		</div>
	);
}

function Sections({ title, callBack, svg }) {
	return (
		<div
			className="w-[80%] [@media(max-width:500px)]:w-[98%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do"
			onClick={() => callBack()}
		>
			<div className="flex items-center gap-[15px] pl-[35px] [@media(max-width:360px)]:pl-[5px]">
				{svg}
				<h1 className=" mt-[10px] mb-[10px] font-bold text-white text-[20px]">
					{title}
				</h1>
			</div>
		</div>
	);
}

function SpecialSection({ children, title, svg }) {
	const [show, setShow] = useState();

	return (
		<div
			className={`w-[80%] [@media(max-width:500px)]:w-[98%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do ${show ? "bg-do" : ""} `}
		>
			<div
				className={`flex items-center gap-[15px] ${show ? "justify-center" : "pl-[35px] [@media(max-width:360px)]:pl-[5px]"}`}
				onClick={() => setShow(!show)}
			>
				{svg}
				<h1 className=" mt-[10px] mb-[10px] font-bold text-white text-[20px]">
					{title}
				</h1>
			</div>
			{show && children}
		</div>
	);
}

function SettingsSection(props) {
	const showSettings = props.showSettings;
	const showBlocked = props.showBlocked;
	const setShowQr = props.setShowQr;

	const navigate = useRouter();
	return (
		<div className="w-[500px] [@media(max-width:650px)]:w-[80%] p-[20px] bg-[#343434] rounded-[25px] relative shadow-lg flex flex-col items-center">
			{closePopopupSvg(showSettings)}

			<h1 className="mt-[10px] mb-[10px] font-bold text-white text-[20px]">
				Settings
			</h1>

			<SpecialSection title={"Delete Account"} svg={AccountSvg}>
				<DeleteComponent />
			</SpecialSection>

			<SpecialSection title={"Security"} svg={SecuritySvg}>
				<Security setShowQr={setShowQr} />
			</SpecialSection>

			<Sections
				callBack={() => showBlocked(true)}
				title={"Blocked User"}
				svg={AboutSvg}
			/>
			<Sections
				callBack={() => logout(navigate)}
				title={"Logout"}
				svg={LogoutSvg}
			/>
		</div>
	);
}

export default SettingsSection;
