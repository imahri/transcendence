import Image from "next/image";
import Link from "next/link";
import { USER_SEARCH_URL } from "@/app/URLS";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";

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
	const url = `${USER_SEARCH_URL}?search=${searchText}`;
	const accessToken = getToken();

	try {
		let response = await fetch(url, {
			headers: { Authorization: `Bearer  ${accessToken}` },
		});
		if (response.ok) {
			const data = await response.json();
			console.log("data : ", data);
			if (data.length == 0) {
				setResult(404);
				return;
			}
			setResult(data);
		} else {
			setResult(404);
		}
		console.log(response);
	} catch (error) {
		console.error("fetch error: " + error);
	}
}
