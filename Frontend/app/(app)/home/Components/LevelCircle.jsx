import React from "react";
import Image from "next/image";
import starpng from "../assets/starpng.png";

function LevelCircle({ level }) {
	const levelPercent = (level - Math.floor(level)) * 100 + "%";
	const levelStyle = {
		background: `conic-gradient(from 0deg, #79DDD7 0% ${levelPercent}, transparent ${levelPercent}, transparent 100%)`,
	};
	return (
		<div className="absolute top-[-9px] left-[-13px] bg-[#202020] size-[150px] [@media(max-width:470px)]:size-[100px] rounded-full flex justify-center items-center">
			<div className="size-[90%] rounded-full opacity-[0.75] flex justify-center items-center bg-gradient-to-r from-red-500 to-indigo-700">
				<div
					style={levelStyle}
					className="size-[90%] rounded-full flex justify-center items-center"
				>
					<div className="size-[90%] rounded-full flex flex-col justify-center items-center bg-gradient-to-r from-red-500 to-indigo-700">
						<h1 className="font-bold text-[30px] text-white">
							{level}
						</h1>
						<Image src={starpng} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default LevelCircle;
