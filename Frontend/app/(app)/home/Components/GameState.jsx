import { IMAGE_URL } from "@/app/URLS";
import Image from "next/image";
import Link from "next/link";

function GameState({ user1, user2, score1, score2 }) {
	const win = "bg-[#FFD700]";
	const lose = "bg-red-600";
	const draw = "bg-green-600";

	let result1_color = score1 > score2 ? win : lose;
	result1_color = score1 == score2 ? draw : result1_color;
	let result2_color = result1_color == win ? lose : win;
	result2_color = result1_color == draw ? draw : result2_color;

	return (
		<div className="flex items-center justify-between  min-w-[200px]">
			<div className="flex flex-col items-center justify-center gap-[10px] w-[80px]">
				<div
					className={` ${result1_color} size-[46px] rounded-full flex justify-center items-center`}
				>
					<Image
						className="size-[95%] rounded-full"
						height={0}
						width={0}
						src={`${IMAGE_URL}?path=${user1.img}`}
						alt="User Image"
					/>
				</div>
				<h2 className="font-chakra text-[10px] text-white w-full overflow-hidden truncate text-center">
					{user1.username}
				</h2>
			</div>
			<div className="bg-[#696969] size-[34px] rounded-full flex justify-center items-center">
				<h2 className={`font-chakra text-[10px] text-white`}>
					{score1} : {score2}
				</h2>
			</div>
			<Link
				className="flex flex-col items-center justify-center gap-[10px] w-[80px]"
				href={`/profile/${user2.username}`}
			>
				<div
					className={`${result2_color} size-[46px] rounded-full flex justify-center items-center`}
				>
					<Image
						width={0}
						height={0}
						className="size-[95%] rounded-full"
						src={`${IMAGE_URL}?path=${user2.img}`}
						alt="Friend Image"
					/>
				</div>
				<h2 className="font-chakra text-[10px] text-white w-full overflow-hidden truncate text-center">
					{user2.username}
				</h2>
			</Link>
		</div>
	);
}

export default GameState;
