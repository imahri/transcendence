"use client";
import React, { useContext, useEffect, useState } from "react";
import NavBar from "../../navBar/NavBar";
import { UserContext } from "../../context";
import Banner from "./Components/Banner";
import ProfileInfo from "./Components/ProfileInfo";
import Dashboard from "./Components/Dashboard";

function Profile({ params }) {
	const [userProfile, setUserProfile] = useState(false);
	const [isLoading, setisLoading] = useState(true);

	const [tmp, setTmp] = useState();

	const { user } = useContext(UserContext);
	// user.friendship = 'owner';

	useEffect(() => {
		if (!userProfile) {
			if (!params) {
				setUserProfile(user);
				setisLoading(false);
				return;
			}
		}
	}, [userProfile]);

	return (
		<>
			<NavBar />
			<main className="w-full  mt-[150px] flex justify-center  h-[1100px]">
				<div className="w-full flex flex-col items-center gap-[20px]">
					<div className="w-[90%] bg-[#353535] rounded-[25px]">
						<Banner />
						<ProfileInfo user={user} displayFriends={setTmp} />
					</div>
					<div className="w-[90%] bg-[#353535] rounded-[25px]">
						<Dashboard />
					</div>
				</div>
			</main>
		</>
	);
}

export default Profile;
