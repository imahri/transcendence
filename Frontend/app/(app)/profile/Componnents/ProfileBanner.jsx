import { ScoreSvg } from "./Allsvg";
import gradeTmp from "../assets/Grade.png";
import Image from "next/image";

function ProfileBanner({ user }) {
	return (
		<div
			style={{ backgroundImage: `url(${user.info.banner_img})` }}
			className="bg-center bg-no-repeat bg-cover h-[327px] w-full rounded-[25px]"
		>
			<div className="h-full w-full rounded-[25px] bg-gradient-to-r from-[#080010] from-40% to-transparent flex items-center justify-between">
				<h1 className="font-Mesthine text-[96px]  text-white ml-[40px]">
					{" "}
					{user.username}
				</h1>
				<div className="h-full rounded-[25px] flex flex-col justify-around items-center mr-[20px]">
					<h3 className="font-semibold text-[16px] text-[#D4D4D4] ">
						Id 45546464646464646464
					</h3>
					<Image className="size-[135px]" src={gradeTmp} alt="" />
					<h3 className="font-normal text-[36px] text-white flex items-center gap-[10px]">
						Score 464 {ScoreSvg}{" "}
					</h3>
				</div>
			</div>
		</div>
	);
}

export default ProfileBanner;
