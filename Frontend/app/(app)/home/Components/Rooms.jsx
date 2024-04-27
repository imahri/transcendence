import React from "react";
import Image from "next/image";

function Rooms({ room }) {
	return (
		<div
			className={`w-[30%] [@media(max-width:1200px)]:w-[90%]  ${room.bg} h-[128px] border-none rounded-[10px] flex items-center pl-[20px] gap-[20px] cursor-pointer`}
		>
			<Image className="size-[88px] rounded-full" src={room.img} alt="" />
			<div className="flex flex-col items-start">
				<h1 className="font-bold text-[20px] text-white">
					{room.user.userName} room
				</h1>
				<h2 className=" font-bold text-[14px] text-[#C8C8C8]">
					{room.user.fullName}
				</h2>
			</div>
		</div>
	);
}

export default Rooms;
