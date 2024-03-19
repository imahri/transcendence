import React from "react";

function Rooms({ room }) {
	return (
		<div
			className={`w-[30%]  max-[1200px]:w-[70%] max-[1200px]:w-[90%]  ${room.bg} h-[128px] border-none rounded-[10px] flex items-center pl-[20px] gap-[20px] cursor-pointer`}
		>
			<img className="size-[88px] rounded-full" src={room.img} alt="" />
			<div className="flex flex-col items-start">
				<h1 className="font-Chakra font-bold text-[20px] text-white">
					{room.user.userName} room
				</h1>
				<h2 className="font-Chakra font-bold text-[14px] text-[#C8C8C8]">
					{room.user.fullName}
				</h2>
			</div>
		</div>
	);
}

export default Rooms;
