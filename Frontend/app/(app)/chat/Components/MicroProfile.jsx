import { APIs } from "@/Tools/fetch_jwt_client";
import Image from "next/image";

export const MicroProfile = ({ onClick, user }) => (
	<div className="w-full h-[7rem] flex justify-between py-4 px-12 ">
		<button
			className="w-52 h-20 flex justify-start items-center text-slate-200"
			onClick={onClick}
		>
			<Image
				className={"h-12 w-12 rounded-full mr-3"}
				src={APIs.image(user.info.profile_img)}
				width={200}
				height={200}
				alt="profile image"
			/>
			<div className="flex flex-col items-start">
				<span className="font-semibold text-lg">
					{user.username.toUpperCase()}
				</span>
				<span className="font-normal text-gray-300 text-xs">{`${user.first_name} ${user.last_name}`}</span>
			</div>
		</button>
	</div>
);

export const MicroProfileFriend = ({ onClick, friend }) => (
	<button
		className="w-52 h-20 flex justify-center items-center text-slate-200 my-3"
		onClick={onClick}
	>
		<Image
			className={"h-10 w-10 rounded-full mr-3"}
			src={APIs.image(friend.img)}
			width={200}
			height={200}
			alt="profile image"
		/>
		<div className="flex flex-col items-start">
			<span className="font-semibold text-md">{friend.username}</span>
			<span className="font-normal text-gray-300 text-xs">{`${friend.first_name} ${friend.last_name}`}</span>
		</div>
	</button>
);
