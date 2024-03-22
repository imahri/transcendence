// "use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import a1 from "../assets/Ache1.png";
import a2 from "../assets/Ache2.png";
import a3 from "../assets/Ache3.png";

import noTrophy from "../assets/notrophy.png";

function ShowRoom() {
	const router = useRouter();

	return (
		<div className="w-full flex gap-[20px] relative  ">
			<div className="w-[406px] h-[178px] bg-[#2B2B2B] rounded-[20px] flex flex-col items-center gap-[20px]">
				<h1 className="font-Chakra font-bold text-[#BABABA] text-[24px] mt-[10px]">
					Achievment
				</h1>
				<div className="flex">
					<Image className="size-[79px]" src={a1} alt="" />
					<Image className="size-[79px]" src={a2} alt="" />
					<Image className="size-[79px]" src={a3} alt="" />
				</div>
			</div>
			<div className="w-[406px] h-[178px] bg-[#2B2B2B] rounded-[20px] flex flex-col items-center gap-[20px]">
				<h1 className="font-Chakra font-bold text-[#BABABA] text-[24px] mt-[10px]">
					Trophy
				</h1>
				<div>
					<Image src={noTrophy} alt="" />
				</div>
			</div>

			<button
				className="w-[106px] h-[38px] bg-greatBlue rounded-[7px] cursor-pointer absolute right-0 bottom-0 font-normal text-[#222222] hover:text-white text-[16px]"
				onClick={() => router.back()}
			>
				Back
			</button>
		</div>
	);
}

export default ShowRoom;
