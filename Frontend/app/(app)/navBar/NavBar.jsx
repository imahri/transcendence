"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../settings/Components/SettingsUtils";
import Link from "next/link";
import { Searchbar } from "../searchBar/Searchbar";
import Notification from "./Components/Notification";

import {
	logoutSvg,
	AccountSvg,
	WalletLogo,
	WalletSvg,
	dropDownSvg,
	dropUpSvg,
} from "./Components/AllSvg";
import { UserContext } from "../context";

function ProfileBar() {
	const { user } = useContext(UserContext);

	// console.log("===> ", user.user.info);

	const [more, setMore] = useState();
	const navigate = useRouter();

	let levelPercent = (user.info.level - Math.floor(user.info.level)) * 100;
	// let levelPercent = (user.info.level - Math.floor(user.info.level)) * 100;

	levelPercent = Math.floor(levelPercent);

	return (
		<>
			<div className="absolute right-[220px]">
				<Notification />
			</div>
			<div className="flex gap-[10px]  items-center fixed top-[20px] right-[50px] max-[550px]:right-[2px] ">
				<div
					className={`w-[170px] p-[5px] bg-[#303030] rounded-[10px] ${!more ? "max-[600px]:bg-transparent" : ""}  `}
				>
					<div
						className="flex items-center justify-around cursor-pointer gap-[10px] "
						onClick={() => setMore(!more)}
					>
						<img
							className="w-[48px] h-[48px] rounded-[5px] max-[600px]:rounded-full"
							src={user.info.profile_img}
							alt=""
						/>
						<div className="max-[600px]:hidden">
							<h3 className=" font-medium text-[20px] text-[#7D7D7D]">
								{user.username}
							</h3>
							{/* {more && ( 
							 <>
							 	<h4 className=" font-medium text-[13px] text-[#7D7D7D]">
							 		{user.first_name} {user.last_name}
							 	</h4>
							 	<div className="h-[5px] w-[80px]  rounded-[50px] bg-black ">
							 		<div className={`h-full w-[${levelPercent}%] bg-[#FF7A00] rounded-[50px]`}>
							 		</div>
							 	</div>
							 </>
						)} */}
						</div>
						{more ? dropUpSvg : dropDownSvg}
					</div>
					{more && (
						<div className="p-[20px] gap-[20px] flex flex-col">
							<div className="flex w-full items-center justify-between gap-2 cursor-pointer ">
								{WalletSvg}{" "}
								<h1 className=" font-medium text-[18px] text-[#7D7D7D]">
									{" "}
									Wallet{" "}
								</h1>{" "}
								<span className=" font-medium text-[18px] text-[#7D7D7D] flex items-center gap-1">
									{user.info.wallet} {WalletLogo}
								</span>
							</div>

							<Link
								href={"/profile"}
								className="flex w-full items-center justify-start gap-2 cursor-pointer"
							>
								{AccountSvg}
								<h1 className=" font-medium text-[18px] text-[#7D7D7D]">
									View Profile
								</h1>
							</Link>

							<div
								className="flex w-full items-center justify-start gap-2 cursor-pointer "
								onClick={() => logout(navigate)}
							>
								{logoutSvg}{" "}
								<h1 className=" font-medium text-[18px] text-[#7D7D7D]">
									Logout
								</h1>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

function NavBar() {
	return (
		<nav className="fixed z-10 flex justify-between mx-px-20 items-center h-[100px] w-[95%] mx-[20px] max-[500px]:mx-0">
			<div className="w-[300px] h-[50px]">
				<Searchbar style_ops="user" />
			</div>
			<ProfileBar />
		</nav>
	);
}

export default NavBar;
