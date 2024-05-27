import { IMAGE_URL } from "@/app/URLS";
import Image from "next/image";

export default function Display({ obj, setDemo, setResult }) {
	return (
		<div className="w-full flex justify-between items-center gap-[10px] h-[50px]">
			<div
				className="w-[80%] cursor-pointer h-full flex justify-between items-center"
				onClick={() => {
					setResult(false), setDemo(obj);
				}}
			>
				<h1 className="font-bold text-[17px] text-[#cccccc]">
					{obj.name}
				</h1>
				<h1 className="font-bold text-[17px] text-[#cccccc]">
					{obj.participants.length}/8
				</h1>
			</div>
			<Image
				className="size-[40px] cursor-pointer rounded-full"
				src={`${IMAGE_URL}?path=${obj.creator.img}`}
				width={40}
				height={40}
				alt="Tournamnt owner"
			/>
		</div>
	);
}
