"use client";
import { createContext, useContext, useEffect, useState } from "react";
import NavBar from "../../navBar/NavBar";
import { UserContext } from "../../context";
import Banner from "./Components/Banner";
import ProfileInfo from "./Components/ProfileInfo";
import Dashboard from "./Components/Dashboard";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { GET_USER_URL } from "@/app/URLS";
import { useRouter } from "next/navigation";
import Friendspopup from "./Components/DisplayFreinds";
import EditProfile from "./Components/EditProfile";

export const UserProfileContext = createContext();

async function getUser(username, setUserProfile, setisLoading, navigate) {
	try {
		const [isOk, status, data] = await fetch_jwt(GET_USER_URL, {
			username: username,
		});

		if (!isOk) {
			console.log("error fetch");
			navigate.replace("/home");
			return;
		}
		setUserProfile(data.user);
		setisLoading(false);
	} catch (error) {
		console.log(error);
	}
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
						<div>Is Loding ...</div>
					) : (
						<div className="w-full flex flex-col items-center gap-[20px]">
							<div className="w-[1700px] [@media(max-width:1860px)]:w-[90%] bg-[#353535] rounded-[25px]">
								<Banner />
								<ProfileInfo
									displayFriends={setDisplayFriends}
									EditProfile={setEditProfile}
								/>
							</div>
							<div className="w-[1700px] [@media(max-width:1860px)]:w-[90%] bg-[#353535] rounded-[25px]">
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
