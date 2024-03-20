import Image from "next/image";

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
			<div className="flex flex-col gap-[10px] ">
				<button className="border-none rounded-[6px] w-[161px] h-[40px] bg-[#3D9D5E] font-semibold text-[16px] text-white cursor-pointer">
					Edit
				</button>
				<button className="border-none rounded-[6px] w-[161px] h-[40px] bg-[#3D6F9D] font-semibold text-[16px] text-white cursor-pointer">
					Add Friend
				</button>
			</div>
		</div>
	);
}

export default ProfileInfo;
