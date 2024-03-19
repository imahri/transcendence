import React from "react";

import profile from "../../Store/assets/profile.png";
import { Link } from "react-router-dom";

function Msg({ msg }) {
	return (
		<div className="flex items-center gap-[10px] relative border-b-[1px] border-solid border-b-[#707070] border-l-0 border-r-0 border-t-0 pb-[10px]">
			<img
				className="size-[39px] rounded-full"
				src={msg.user.image}
				alt=""
			/>
			<div>
				<h2 className="font-Chakra font-normal text-[13px] text-white">
					{msg.user.userName}
				</h2>
				<h3 className="font-Chakra font-normal text-[10px] max-w-[200px] overflow-hidden  text-[#C3C3C3]">
					{msg.message}
				</h3>
			</div>
			<div className="absolute right-[10px] flex flex-col justify-center items-center">
				<h3 className="font-Chakra font-normal text-[10px] text-[#C3C3C3]">
					{msg.time}
				</h3>
				<div className="size-[12px] bg-[#3294A7] rounded-full flex justify-center items-center">
					<h3 className="font-Chakra font-normal text-[7px] text-[#353535]">
						2
					</h3>
				</div>
			</div>
		</div>
	);
}

const user = (userName, image) => {
	return { userName: userName, image: image };
};

const Msgs = [
	{ user: user("oussama", profile), message: "weshh hani", time: 2.3 },
	{ user: user("assema", profile), message: "weshh hani", time: 5.3 },
	{ user: user("Fucking fact", profile), message: "mrta7", time: "now" },
	{ user: user("NabFake", profile), message: "cvv ", time: 3.1 },
	{ user: user("popop", profile), message: "feeen", time: 6.5 },
	{
		user: user("redmega", profile),
		message:
			"hak dcfcfvfvfvfvfvfvfvfvdcdddcfjvbfjvbfjbvjfbvfbvjkfvjfbvjfbvjfbvfbvjfbvjfbvjfbvjfbvjfbvjfbvfjbv",
		time: 4.2,
	},
	{ user: user("fiddler", profile), message: "servfv", time: 1.23 },
	{ user: user("sakawi", profile), message: "weshdcdcfvvf", time: 8.45 },
];

function LastNotif() {
	return (
		<div className="bg-[#353535] w-[30%] max-[1702px]:w-[25%] py-[10px] rounded-[15px] flex flex-col items-center justify-center gap-[10px] max-[1500px]:order-2 max-[1500px]:w-[50%] max-[710px]:w-[90%]">
			<div className="flex items-center justify-between w-[60%] max-[1990px]:w-[80%]">
				<h1 className="font-Chakra font-normal text-[18px] text-[#C3C3C3]">
					Message
				</h1>
				<div className="font-Chakra font-light text-[18px] text-white text-center border-none rounded-[5px] bg-greatBlue w-[44px] h-[29px] cursor-pointer ">
					Go
				</div>
			</div>
			<div className=" flex flex-col gap-[15px]  w-[60%] max-[1990px]:w-[80%]">
				<h3 className="font-Chakra font-extralight text-[12px] text-[#C3C3C3]">
					Last Notification
				</h3>
				<div className="flex flex-col gap-[20px] h-[250px] overflow-y-auto pr-[10px]">
					{Msgs.map((msg, index) => {
						return (
							<div key={index}>
								<Msg msg={msg} />{" "}
							</div>
						);
					})}
				</div>
			</div>
			<Link className="font-Chakra font-normal text-[15px] text-[#00FE75] no-underline">
				show all messages
			</Link>
		</div>
	);
}

export default LastNotif;
