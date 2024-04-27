import Storelogo from "./assets/storeLogo.png";
import Title from "./assets/title.png";

import Padlles from "./Components/Padlles";
import Boards from "./Components/Boards";
import Badges from "./Components/Badges";
import NavBar from "../navBar/NavBar.jsx";

import Image from "next/image";

function Store() {
	return (
		<>
			<NavBar />

			<div className="w-full mt-[100px] flex flex-col items-center gap-[30px]">
				<div className="w-[90%] bg-[#353535] opacity-[63%] p-[10px] rounded-[10px] flex flex-col items-center justify-between gap-[10px] relative">
					<div className="bg-[#190019] flex justify-around w-[50%] rounded-[22px] [@media(max-width:1155px)]:w-full">
						<Image
							className="rounded-[22px] [@media(max-width:580px)]:h-[100px] [@media(max-width:428px)]:h-[80px]"
							src={Title}
							alt=""
						/>
						<Image
							className="rounded-[22px] [@media(max-width:580px)]:size-[100px] [@media(max-width:428px)]:w-[80px] [@media(max-width:428px)]:h-[80px]"
							src={Storelogo}
							alt=""
						/>
					</div>
					{/* <div className={styles.ads}></div> */}
				</div>
				<div className="w-[90%] bg-[#353535] opacity-[63%] p-[10px] rounded-[10px] flex flex-col items-center relative">
					<h1 className="text-[30px] text-white font-medium">
						{" "}
						Paddle
					</h1>
					<div className="w-full flex items-center overflow-x-scroll">
						<Padlles />
					</div>
				</div>
				<div className="w-[90%] bg-[#353535] opacity-[63%] p-[10px] rounded-[10px] flex flex-col items-center relative">
					<h1 className="text-[30px] text-white font-medium">
						{" "}
						Board
					</h1>

					<div className="w-full flex items-center overflow-x-scroll">
						<Boards />
					</div>
				</div>
				<div className="w-[90%] bg-[#353535] opacity-[63%] p-[10px] rounded-[10px] flex flex-col items-center relative">
					<h1 className="text-[30px] text-white font-medium">
						{" "}
						Badge
					</h1>
					<div className="w-full flex items-center overflow-x-scroll">
						<Badges />
					</div>
				</div>
			</div>
		</>
	);
}

export default Store;
