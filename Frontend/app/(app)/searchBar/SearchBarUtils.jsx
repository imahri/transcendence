import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/app/URLS";

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
				src={data.img}
				alt=""
			/>
			<div className=" max-w-[170px] overflow-x-hidden">
				<h1 className="text-white font-semibold truncate">
					{data.first_name} {data.last_name}
				</h1>
				<h3 class=" font-medium text-[13px] text-[#7D7D7D] ml-[5px] truncate">
					{data.username}
				</h3>
			</div>
		</Link>
	);
}

export function UserNotFound({ input }) {
	return (
		<h1 class="text-white font-semibold truncate max-w-[250px] overflow-x-hidden">
			No result for :
			<span className="font-normal text-[14px]">{input}</span>
		</h1>
	);
}

export async function searchForUsers(searchText, setResult) {
	try {
		let response = await fetch(
			`http://localhost:8000/user/search?search=${searchText}`,
		);
		if (response.ok) {
			const data = await response.json();
			console.log("data : ", data);
			setResult(data);
		} else {
			setResult(404);
		}
		console.log(response);
	} catch (error) {
		console.error("fetch error: " + error);
	}
}
