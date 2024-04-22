import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { closePopopupSvg } from "@/app/(auth)/2Fa/Popup";
import { GET_Blocked_URL } from "@/app/URLS";
import React, { useEffect, useState } from "react";

function BlockedUsers({ setPopUp }) {
	const [BlockedUsers, setBlockedUsers] = useState();

	// useEffect(() => {

	//     if (!BlockedUsers){
	//         //fetch all blocked users
	//         fetch_jwt(GET_Blocked_URL)
	//     }

	// }, [BlockedUsers])

	return (
		<div className="w-[620px] max-[650px]:w-[90%] flex flex-col items-center gap-[20px] bg-[#343434] rounded-[25px] shadow-[0_4px_40px_5px_rgba(0,0,0,0.7)] relative">
			{closePopopupSvg(setPopUp)}
			<h1 className=" font-bold text-[30px] text-white mt-[50px] max-[560px]:text-[20px] max-[460px]:text-[16px]">
				Blocked Users
			</h1>
		</div>
	);
}

export default BlockedUsers;
