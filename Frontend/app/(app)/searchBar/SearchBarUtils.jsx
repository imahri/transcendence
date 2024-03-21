import Image from "next/image";
import profile from "../home/assets/profile.png";

function Result({ data }) {
	return (
		<div className="flex gap-[10px] items-center cursor-pointer">
			<Image className="size-[40px] rounded-full" src={profile} alt="" />
			<div className=" max-w-[170px] overflow-x-hidden">
				<h1 className="text-white font-semibold ">
					{data.first_name} {data.last_name}
				</h1>
				<h3 class=" font-medium text-[13px] text-[#7D7D7D] ml-[5px]">
					{data.username}{" "}
				</h3>
			</div>
		</div>
	);
}

export default Result;
