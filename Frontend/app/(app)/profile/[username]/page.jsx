"use client";
import { createContext, useContext, useEffect, useState } from "react";
import NavBar from "../../navBar/NavBar";
import { UserContext } from "../../context";
import Banner from "./Components/Banner";
import ProfileInfo from "./Components/ProfileInfo";
import Dashboard from "./Components/Dashboard";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import { useRouter } from "next/navigation";
import Friendspopup from "./Components/DisplayFreinds";
import EditProfile from "./Components/EditProfile";
import { Loader } from "@/app/Components/Loader";

export const UserProfileContext = createContext();

async function getUser(username, setUserProfile, setisLoading, navigate) {
	const [isOk, status, data] = await fetch_jwt(APIs.user.get_user, {
		username: username,
	});
	if (!isOk) {
		console.log("error fetch");
		navigate.replace("/home");
		return;
	}
	setUserProfile(data.user);
	setisLoading(false);
}

function Profile({ params }) {
	const [userProfile, setUserProfile] = useState(false);
	const [Edit, setEditProfile] = useState(false);
	const [isLoading, setisLoading] = useState(true);
	const navigate = useRouter();
	const [displayFriends, setDisplayFriends] = useState();

	const { user } = useContext(UserContext);
	user.friendship = "owner";

	useEffect(() => {
		if (!params) {
			setUserProfile(user);
			setisLoading(false);
			return;
		}
		getUser(params.username, setUserProfile, setisLoading, navigate);
	}, [user]);

	return (
		<>
			<NavBar />
			<UserProfileContext.Provider value={userProfile}>
				<main className="w-full  mt-[100px] [@media(max-width:900px)]:mb-[70px] flex justify-center">
					{isLoading ? (
						<Loader />
					) : (
						<div className="w-full flex flex-col items-center gap-[20px]">
							<div className="w-[1700px] [@media(max-width:1860px)]:w-[90%] bg-[#2A2A2A] rounded-[25px]">
								<Banner />
								<ProfileInfo
									displayFriends={setDisplayFriends}
									EditProfile={setEditProfile}
								/>
							</div>
							<div className="w-[1700px] [@media(max-width:1860px)]:w-[90%] bg-[#2A2A2A] rounded-[25px] mb-[10px]">
								<Dashboard />
							</div>
						</div>
					)}
				</main>
				{displayFriends && (
					<Friendspopup
						DisplayFriends={setDisplayFriends}
						username={userProfile.username}
					/>
				)}
				{Edit && <EditProfile closePopup={setEditProfile} />}
			</UserProfileContext.Provider>
		</>
	);
}

export default Profile;
