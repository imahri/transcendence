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
					<div className="w-[95%] flex items-center gap-[20px]">
						{/* <div className='bg-gray-600 w-[20%] h-full rounded-[31px]'>
						</div> */}
						<FirstSection />
						<SecondSection otherUser={user} />
					</div>
				)}
			</main>
		</>
	);
}

export default page;
