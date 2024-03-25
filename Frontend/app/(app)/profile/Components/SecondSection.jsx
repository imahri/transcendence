"use client";
import { useContext, useEffect, useState } from "react";

import ProfileBanner from "./ProfileBanner";
import ProfileInfo from "./ProfileInfo";
import Skins from "./Skins";
import ShowRoom from "./ShowRoom";

import { UserContext } from "../../layout";

function SecondSection({ otherUser }) {
	const { user } = !otherUser ? useContext(UserContext) : otherUser;

	return (
		<div className="w-[80%] flex flex-col gap-[30px] max-[1530px]:w-[95%] max-[1530px]:order-1">
			<div className="w-full">
				<ProfileBanner user={user} />
				<ProfileInfo user={user} />
			</div>
			<Skins user={user} />
			<ShowRoom />
		</div>
	);
}

export default SecondSection;
