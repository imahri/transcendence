import React from "react";

import IMG from "../../home/assets/profile.png";

function Friend({ friend }) {
	return (
		<div className=" flex items-center gap-[20px]">
			{
				<img
					className="size-[60px] rounded-full"
					src={friend.image}
					alt=""
				/>
			}
			<div>
				<h2 className="font-Chakra font-semibold text-[20px] text-white">
					{friend.name}
				</h2>
				<h3 className="font-Chakra font-bold text-[14px] text-[#C8C8C8]">
					{friend.firstName} {friend.lastName}{" "}
				</h3>
			</div>
		</div>
	);
}

const friend = {
	image: IMG,
	name: "Sakawi",
	firstName: "oussama",
	lastName: "krich",
};

const friends = [
	friend,
	friend,
	friend,
	friend,
	friend,
	friend,
	friend,
	friend,
];

function Friends() {
	return (
		<div className="w-[90%] h-[450px] bg-[#353535] rounded-[31px] flex flex-col justify-center pl-[30px] gap-[20px]">
			<h1 className="font-Chakra font-semibold text-[36px] text-[#BABABA]">
				Friends
			</h1>
			<div className="w-[90%] h-[400px] flex flex-col gap-[20px] overflow-auto mb-[20px]">
				{friends.map((friend) => {
					return <Friend friend={friend} />;
				})}
			</div>
		</div>
	);
}

export default Friends;
