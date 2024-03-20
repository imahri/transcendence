import Logo from "./assets/logo-login.png";
import Links from "./Links.jsx";
import Image from "next/image";

export default function SideBar(props) {
	return (
		<div className="bg-[#353535] fixed w-[80px] h-full z-[1] max-[900px]:w-full max-[900px]:bottom-0 max-[900px]:h-[65px] max-[900px]:flex">
			<div className="flex justify-center mt-[20px] mb-[40px] max-[900px]:hidden">
				<Image className="size-[81px]" src={Logo} alt="" />
			</div>

			<div className="h-[30%] mt-[20px] max-[900px]:mt-0 max-[900px]:mx-[15px] max-[900px]:size-full max-[900px]:flex max-[900px]:transition max-[900px]:duration[2000ms]">
				<Links showSettings={props.showSettings} />
			</div>
		</div>
	);
}
