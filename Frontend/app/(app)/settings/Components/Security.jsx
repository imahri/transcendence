import { useContext, useEffect, useState } from "react";
import { TowFaHandler, getCodeQr } from "./SettingsUtils.js";
import { UserContext } from "../../context";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { USER_URL } from "@/app/URLS";

function Security({ setShowQr }) {
	const { user, setUser } = useContext(UserContext);

	const [TowFa, setTowFa] = useState(user.is_2FA_active);
	const [qrCode, setQrCode] = useState();

	useEffect(() => {
		const refetchUser = async () => {
			//refetch user after update 2Fa state
			const [isOk, status, data] = await fetch_jwt(USER_URL);

			if (isOk) {
				setUser(data);
			}
		};
		refetchUser();
	}, [TowFa]);

	return (
		<>
			<div className="cursor-default">
				<div className="flex items-center justify-around">
					<h1 className=" mt-[10px] mb-[10px] font-bold text-white text-[20px]">
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
						className=" mt-[10px] mb-[10px] font-semibold text-white opacity-[44%] text-[17px] text-center cursor-pointer hover:opacity-[1]"
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
