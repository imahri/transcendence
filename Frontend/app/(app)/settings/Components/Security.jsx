import React, { useState } from "react";
import { TowFaHandler, getCodeQr } from "./SettingsUtils";

// TowFa is the state of user 2FA is true

function Security({ setShowQr }) {
	const [TowFa, setTowFa] = useState();
	const [qrCode, setQrCode] = useState();

	return (
		<>
			<div className="cursor-default">
				<div className="flex items-center justify-around">
					<h1 className="font-Chakra mt-[10px] mb-[10px] font-bold text-white text-[20px]">
						{" "}
						{!TowFa ? "Activate " : "Desactivate "} 2Fa{" "}
					</h1>
					<div
						className={`w-[35px] h-[20px] bg-[#D9D9D9] rounded-[20px]  p-[2px] cursor-pointer flex  ${TowFa ? "justify-end" : ""}`}
						onClick={() => TowFaHandler(TowFa, setTowFa, setQrCode)}
					>
						<div className="h-full w-[55%] bg-[#1D1D1D] opacity-[67%] rounded-full"></div>
					</div>
				</div>
				{TowFa && (
					<h2
						className="font-Chakra mt-[10px] mb-[10px] font-semibold text-white opacity-[44%] text-[17px] text-center cursor-pointer hover:opacity-[1]"
						onClick={() => getCodeQr(setShowQr, qrCode)}
					>
						Show Qr Code
					</h2>
				)}
			</div>
		</>
	);
}

export default Security;
