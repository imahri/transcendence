import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../../layout";

function Button({ callBack, action, color }) {
	return (
		<button
			className={`border-none rounded-[6px] w-[161px] h-[40px] bg-[${color}] font-semibold text-[16px] text-white cursor-pointer`}
		>
			{action}
		</button>
	);
}

//edit is my // is not friend Add Friend is Friend block or remove
function Buttons({ profileUser }) {
	const { user } = useContext(UserContext);
	const status = profileUser.id == user.id ? "owner" : "other";

	return (
		<div className="flex flex-col gap-[10px] ">
			{status == "owner" && <Button action={"Edit"} color={"#3D9D5E"} />}
			{status == "other" && (
				<Button action={"Add Friend"} color={"#3D6F9D"} />
			)}
			{/* <Button action={'Block'} color={'#3D9D5E'} />				 */}
			{/* <Button action={'Remove'} color={'#3D6F9D'} />				 */}
		</div>
	);
}

function ProfileInfo({ user }) {
	return (
		<div className="w-full h-[130px]  flex items-center justify-between relative">
			<Image
				className="rounded-[31px] w-[138px] h-[126px] absolute top-[-20px] left-[50px]"
				src={user.info.profile_img}
				width={0}
				height={0}
				alt=""
			/>
			<div className="ml-[200px]">
				<h1 className="font-semibold text-[40px] text-white">
					{user.first_name} {user.last_name}
				</h1>
				<h2 className="font-semibold text-[24px] text-[#ABABAB] ">
					{" "}
					Level {user.info.level}
				</h2>
			</div>
			<Buttons profileUser={user} />
		</div>
	);
}

export default ProfileInfo;
