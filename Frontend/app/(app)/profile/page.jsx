import NavBar from "../NavBar/NavBar";

import FirstSection from "./Componnents/FirstSection";
import SecondSection from "./Componnents/SecondSection";

function Profile() {
	return (
		<>
			<NavBar />
			<div className="w-[95%] mt-[100px] flex items-center justify-center">
				<div className="w-[100%] flex items-center justify-around">
					<FirstSection />

					<SecondSection />
				</div>
			</div>
		</>
	);
}

export default Profile;
