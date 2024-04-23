import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Security from "./Security";
import { logout } from "./SettingsUtils";

import { AccountSvg, AboutSvg, SecuritySvg, LogoutSvg } from "./Icons";
import { closePopopupSvg } from "@/app/(auth)/2Fa/Popup";

function SettingsSection(props) {
	const showSettings = props.showSettings;
	const showBlocked = props.showBlocked;
	const [security, setSecurity] = useState();
	const setShowQr = props.setShowQr;

	const navigate = useRouter();
	return (
		<div className="w-[500px] max-[650px]:w-[80%] p-[20px] bg-[#343434] rounded-[25px] relative shadow-lg flex flex-col items-center">
			{closePopopupSvg(showSettings)}

			<h1 className="mt-[10px] mb-[10px] font-bold text-white text-[20px]">
				Settings
			</h1>

			<div className="w-[80%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do">
				<div className="flex items-center gap-[15px] pl-[35px] max-[260px]:pl-[10px]">
					{AccountSvg}
					<h1 className=" mt-[10px] mb-[10px] font-bold text-white text-[20px]">
						Account
					</h1>
				</div>
			</div>

			<div
				className={`w-[80%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do ${security ? "bg-do" : ""} `}
			>
				<div
					className={`flex items-center gap-[15px]  ${security ? "justify-center" : "pl-[35px] max-[260px]:pl-[10px]"}`}
					onClick={() =>
						security ? setSecurity(false) : setSecurity(true)
					}
				>
					{SecuritySvg}
					<h1 className=" mt-[10px] mb-[10px] font-bold text-white text-[20px]">
						Security
					</h1>
				</div>
				{security && <Security setShowQr={setShowQr} />}
			</div>
			<div className="w-[80%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do">
				<div
					className="flex items-center gap-[15px] pl-[35px] max-[260px]:pl-[10px]"
					onClick={() => showBlocked(true)}
				>
					{AboutSvg}
					<h1 className=" mt-[10px] mb-[10px] font-bold text-white text-[20px]">
						Blocked User
					</h1>
				</div>
			</div>
			<div
				className="w-[80%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do"
				onClick={() => logout(navigate)}
			>
				<div className="flex items-center gap-[15px] pl-[35px] max-[260px]:pl-[10px]">
					{LogoutSvg}
					<h1 className=" mt-[10px] mb-[10px] font-bold text-white text-[20px]">
						Logout
					</h1>
				</div>
			</div>
		</div>
	);
}

export default SettingsSection;
