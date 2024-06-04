import Image from "next/image";
import Link from "next/link";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";

export function Result({ data }) {
	return (
		<Link
			href={`/profile/${data.username}`}
			className="flex gap-[10px] items-center cursor-pointer opacity-[70%] hover:opacity-[100%]"
		>
			<Image
				className="size-[40px] rounded-full"
				width={0}
				height={0}
				src={APIs.image(data.img)}
				alt="friend image"
			/>
			<div className=" max-w-[170px] overflow-x-hidden">
				<h1 className="text-white font-semibold truncate">
					{data.first_name} {data.last_name}
				</h1>
				<h3 className=" font-medium text-[13px] text-[#7D7D7D] ml-[5px] truncate">
					{data.username}
				</h3>
			</div>
		</Link>
	);
}

export function UserNotFound({ input }) {
	return (
		<h1 className="text-white font-semibold truncate max-w-[250px] flex justify-center items-center gap-[10px] overflow-x-hidden">
			No result for :
			<span className="font-normal text-[14px]">{input}</span>
		</h1>
	);
}

export async function searchForUsers(searchText, setResult) {
	const [isOk, status, data] = await fetch_jwt(APIs.user.search, {
		search: searchText,
	});
	if (!isOk) {
		setResult(404);
		return;
	}
	if (data.length == 0) {
		setResult(404);
		return;
	}
	setResult(data);
}
