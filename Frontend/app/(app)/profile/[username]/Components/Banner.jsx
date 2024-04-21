import Image from "next/image";
import BannerImg from "../assets/BannerImg.png";

function Banner() {
	return (
		<div className="w-full h-[290px] relative ">
			<Image src={BannerImg} fill className="rounded-t-[25px]" />
		</div>
	);
}

export default Banner;
