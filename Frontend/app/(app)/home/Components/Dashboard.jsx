import LastGame from "./LastGame";
import Historic from "./Historic";
import StaffMission from "./StaffMission";
import LastNotif from "./LastNotif";
import Rooms from "./Rooms";
import "./Dashboard.css";

import room1 from "../assets/room1.png";
import room2 from "../assets/room2.png";
import room3 from "../assets/room3.png";

const FirstRoom = {
	img: room1,
	bg: "bg-goto",
	user: { userName: "Redmega", fullName: "Redouane Iben Hamou" },
};
const SecondRoom = {
	img: room2,
	bg: "bg-greatBlue",
	user: { userName: "Sakawi", fullName: "Oussama Krich" },
};
const ThirdRoom = {
	img: room3,
	bg: "bg-the_great",
	user: { userName: "Fiddler", fullName: "Imad eddine Mahri" },
};

function Dashboard() {
	return (
		<div className="w-[95%] flex flex-col gap-[20px]">
			<div className="w-full flex justify-between gap-[20px] max-[1500px]:flex-wrap max-[1500px]:justify-center max-[1500px]:gap-x-[0px] max-[1500px]:gap-y-[20px]">
				<LastNotif />

				<div className="w-[45%] max-[1702px]:w-[60%] rounded-[15px] bg-[#D9D9D9] bg-opacity-[5%] max-[1500px]:order-1 max-[1500px]:w-[100%]">
					<div className="dashboardBack flex rounded-[15px] bg-center bg-cover bg-no-repeat max-[720px]:flex-col max-[720px]:items-center">
						<LastGame />
						<Historic />
					</div>
				</div>
				<StaffMission />
			</div>

			<div className="w-[100%] flex justify-between max-[1200px]:flex-col max-[1200px]:items-center max-[1200px]:justify-center max-[1200px]:gap-[20px]">
				<Rooms room={FirstRoom} />
				<Rooms room={SecondRoom} />
				<Rooms room={ThirdRoom} />
			</div>
		</div>
	);
}

export default Dashboard;
