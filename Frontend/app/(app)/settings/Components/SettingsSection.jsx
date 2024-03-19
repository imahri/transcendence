import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Security from "./Security";
import { logout } from "./SettingsUtils";

import { AccountSvg, AboutSvg, SecuritySvg, LogoutSvg } from "./Icons";

function SettingsSection(props) {
	const showSettings = props.showSettings;
	const [security, setSecurity] = useState();
	const setShowQr = props.setShowQr;

	const navigate = useRouter();
	return (
		<div className="w-[500px] max-[650px]:w-[80%] p-[20px] bg-[#343434] rounded-[25px] relative shadow-lg flex flex-col items-center">
			<svg
				onClick={() => showSettings(false)}
				className="absolute top-[20px] right-[20px] cursor-pointer"
				width="20"
				height="20"
				viewBox="0 0 26 26"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16.0807 13L25.3668 3.71137C26.2111 2.86695 26.2111 1.47774 25.3668 0.633316C24.5227 -0.211105 23.1338 -0.211105 22.2896 0.633316L13.0034 9.92195L3.7172 0.633316C2.873 -0.211105 1.48416 -0.211105 0.639958 0.633316C0.217858 1.05553 0 1.61393 0 2.17234C0 2.73075 0.217858 3.28916 0.639958 3.71137L9.92616 13L0.639958 22.2886C0.217858 22.7108 0 23.2693 0 23.8277C0 24.3861 0.217858 24.9445 0.639958 25.3667C1.48416 26.2111 2.873 26.2111 3.7172 25.3667L13.0034 16.0781L22.2896 25.3667C23.1338 26.2111 24.5227 26.2111 25.3668 25.3667C26.2111 24.5223 26.2111 23.1331 25.3668 22.2886L16.0807 13Z"
					fill="white"
					fillOpacity="0.29"
				/>
			</svg>
			<h1 className="font-Chakra mt-[10px] mb-[10px] font-bold text-white text-[20px]">
				Settings
			</h1>

			<div className="w-[80%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do">
				<div className="flex items-center gap-[15px] pl-[35px] max-[260px]:pl-[10px]">
					{AccountSvg}
					<h1 className="font-Chakra mt-[10px] mb-[10px] font-bold text-white text-[20px]">
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
					<h1 className="font-Chakra mt-[10px] mb-[10px] font-bold text-white text-[20px]">
						Security
					</h1>
				</div>
				{security && <Security setShowQr={setShowQr} />}
			</div>
			<div className="w-[80%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do">
				<div className="flex items-center gap-[15px] pl-[35px] max-[260px]:pl-[10px]">
					{AboutSvg}
					<h1 className="font-Chakra mt-[10px] mb-[10px] font-bold text-white text-[20px]">
						About
					</h1>
				</div>
			</div>
			<div
				className="w-[80%] h-auto bg-[#1D1D1D] opacity-[67%] my-[10px] mx-[20px] rounded-[10px] cursor-pointer hover:bg-do"
				onClick={() => logout(navigate)}
			>
				<div className="flex items-center gap-[15px] pl-[35px] max-[260px]:pl-[10px]">
					{LogoutSvg}
					<h1 className="font-Chakra mt-[10px] mb-[10px] font-bold text-white text-[20px]">
						Logout
					</h1>
				</div>
			</div>
		</div>
	);
}

export default SettingsSection;
