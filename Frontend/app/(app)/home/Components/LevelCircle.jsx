import Image from "next/image";
import starpng from "../assets/Star.svg";

function LevelCircle({ level }) {
	let levelPercent = (level - Math.floor(level)) * 100 + "%";
	if (levelPercent == "0%") {
		levelPercent = "1.5%";
		level = level + ".0";
	}
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
						<h1 className="font-bold text-[30px] [@media(max-width:470px)]:text-[16px] text-white">
							{level}
						</h1>
						<Image
							className="[@media(max-width:470px)]:size-[30px]"
							src={starpng}
							alt="Star for Level"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LevelCircle;
