"use client";
import { useContext, useEffect, useState } from "react";
import NavBar from "../../navBar/NavBar";
import { UserContext } from "../../context";
import Banner from "./Components/Banner";
import ProfileInfo from "./Components/ProfileInfo";
import Dashboard from "./Components/Dashboard";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { GET_USER_URL } from "@/app/URLS";
import { useRouter } from "next/navigation";
import Friendspopup from "./Components/DisplayFreinds";

function Profile({ params }) {
	const [userProfile, setUserProfile] = useState(false);
	const [isLoading, setisLoading] = useState(true);
	const navigate = useRouter();

	const [displayFriends, setDisplayFriends] = useState();

	const { user } = useContext(UserContext);
	user.friendship = "owner";

	useEffect(() => {
		if (!userProfile) {
			if (!params) {
				setUserProfile(user);
				setisLoading(false);
				return;
			}
			fetch_jwt(GET_USER_URL, { username: params.username }).then(
				([isOk, status, data]) => {
					if (isOk) {
						//check if user is blocked i can see it
						if (
							data.user.friendship == "B" ||
							data.user.friendship == "BY"
						) {
							navigate.replace("/home");
							return;
						}
						setUserProfile(data.user);
						setisLoading(false);
					} else {
						console.log("error fetch");
					}
				},
			);
		}
	}, [userProfile]);

	return (
		<>
			<NavBar />
			<main className="w-full  mt-[150px] flex justify-center  h-[1100px]">
				{isLoading ? (
					<div>Is Loding ...</div>
				) : (
					<div className="w-full flex flex-col items-center gap-[20px]">
						<div className="w-[90%] bg-[#353535] rounded-[25px]">
							<Banner />
							<ProfileInfo
								user={userProfile}
								displayFriends={setDisplayFriends}
							/>
						</div>
						<div className="w-[90%] bg-[#353535] rounded-[25px]">
							<Dashboard />
						</div>
					</div>
				)}
			</main>
			{displayFriends && (
				<Friendspopup DisplayFriends={setDisplayFriends} />
			)}
		</>
	);
}

export default Profile;
