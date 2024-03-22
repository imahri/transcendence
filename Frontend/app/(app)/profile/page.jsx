import NavBar from "../NavBar/NavBar";

import FirstSection from "./Components/FirstSection";
import SecondSection from "./Components/SecondSection";

function Profile() {
	return (
		<>
			<NavBar />

			<main className="w-full mt-[150px] flex justify-center">
				<div className="w-[95%] flex items-center gap-[20px]">
					<FirstSection />

					<SecondSection />
				</div>
			</main>
		</>
	);
}

export default Profile;
