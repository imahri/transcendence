"use client";
import { useContext } from "react";

import ProfileBanner from "./ProfileBanner";
import ProfileInfo from "./ProfileInfo";
import Skins from "./Skins";
import ShowRoom from "./ShowRoom";

import { UserContext } from "../../layout";

function SecondSection() {
	const { user } = useContext(UserContext);

	return (
		<div className="w-[80%] h-full  flex  flex-col gap-[20px]">
			<div className="w-full  ">
				<ProfileBanner user={user} />
				<ProfileInfo user={user} />
			</div>

			{/* <Skins user={user} /> */}
			<ShowRoom />
		</div>
	);
}

export default SecondSection;
