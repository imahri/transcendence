"use client";
import { useState, useEffect } from "react";
import NavBar from "../../navBar/NavBar";

import { getUser } from "../[username]/UserProfileUtils";

import FirstSection from "../Components/FirstTmp";
import SecondSection from "../Components/SecondSection";

function page({ params }) {
	const [isLoading, setLoading] = useState(true);

	const [user, setUser] = useState();

	useEffect(() => {
		getUser(params.username).then((userData) => {
			setUser(userData);
			setLoading(false);
		});
	}, []);

	return (
		<>
			<NavBar />
			<main className="w-full mt-[150px] flex justify-center">
				{isLoading ? (
					<div className="text-white">is Loading.......</div>
				) : (
					<div className="w-[95%] max-[1700px]:w-[98%]  flex max-[1530px]:flex-col max-[1530px]:items-center gap-[20px]">
						<FirstSection />
						<SecondSection otherUser={user} />
					</div>
				)}
			</main>
		</>
	);
}

export default page;
