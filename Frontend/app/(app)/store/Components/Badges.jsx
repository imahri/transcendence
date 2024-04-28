"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Badge from "./Badge";
import common from "./styles/Common.module.css";

import { BADGES_URL } from "../../../URLS";
import { walletSvg, getStoreItem } from "./StoreItems";
import profile from "../assets/profile.png";

const user = {
	username: "sakawi",
	level: 2.77,
	email: "sakawioussama@gmail.com",
	rank: "master",
	image: profile,
};

function BadgeItem(props) {
	const [show, setshow] = useState();

	const obj = props.obj;

	return (
		<div className="flex flex-col items-center gap-[10px]">
			<div
				className="w-[360px] h-[202px] relative cursor-pointer [@media(max-width:900px)]:w-[300px] [@media(max-width:900px)]:h-[174px]"
				onClick={() => setshow(!show)}
			>
				<Badge BadgeInfo={obj} />
				{!show && (
					<div
						className={`${common.locked} rounded-[14px]  bg-center bg-cover bg-no-repeat size-full hover:opacity-0 absolute top-0`}
					></div>
				)}
			</div>
			{show && (
				<button className="w-[116px] h-[45px] rounded-[10px] bg-[#23A3BF] text-white text-[17px] font-bold cursor-pointer flex justify-center items-center">
					Buy {obj.price}
					{walletSvg}
				</button>
			)}
		</div>
	);
}

async function getItems(setBadgesObjs, navigate) {
	const data = await getStoreItem(BADGES_URL, navigate);
	if (!data) return;
	data.forEach((element) => {
		element.user = user;
	});
	setBadgesObjs(data);
}

function Badges() {
	const navigate = useRouter();
	const [BadgeObjs, setBadgesObjs] = useState();

	useEffect(() => {
		getItems(setBadgesObjs, navigate);
	}, []);

	return (
		<>
			{BadgeObjs && (
				<div className="flex items-center gap-[30px] py-[25px] pl-[20px]">
					{BadgeObjs.map((obj, index) => {
						return (
							<div key={index}>
								<BadgeItem obj={obj} />{" "}
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}

export default Badges;
