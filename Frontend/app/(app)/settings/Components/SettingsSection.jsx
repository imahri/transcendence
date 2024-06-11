import { useState } from "react";
import { useRouter } from "next/navigation";
import Security from "./Security";
import { logout } from "./SettingsUtils.js";

import { AccountSvg, AboutSvg, SecuritySvg, LogoutSvg } from "./Icons";
import { closePopopupSvg } from "@/app/(auth)/2Fa/Popup";

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

			{/* <SpecialSection title={"Delete Account"} svg={AccountSvg}>
				<DeleteComponent />
			</SpecialSection> */}

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
