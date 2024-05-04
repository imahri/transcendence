import Historic from "@/app/(app)/home/Components/Historic";
import LastGame from "@/app/(app)/home/Components/LastGame";

export default function MyState() {
	return (
		<div className="w-[95%] h-[600px] flex justify-center items-center gap-[20px]">
			<div className="h-full w-[30%] bg-green-300">state</div>
			<div className="h-full w-[70%] rounded-[10px] bg-[#2F2F2F] flex justify-center items-center">
				<LastGame />
				<Historic />
			</div>
		</div>
	);
}
