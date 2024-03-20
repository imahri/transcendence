"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getStoreItem, walletSvg } from "./StoreItems";
import { PADDLES_URL } from "../../../URLS";
import styles from "./styles/Common.module.css";

// import locked from '../assets/locked3.png';
//  convert it to tailwind transition: transform 0.3s ease;

async function createPadllesObj(setPaddleObj, navigate) {
	let data = await getStoreItem(PADDLES_URL, navigate);
	if (!data) {
		return;
	}
	setPaddleObj(data);
}

function Paddle({ obj, setPopup }) {
	const style = {
		backgroundImage: `url("${obj.image}")`,
	};
	// const styleLocked = {
	// 		backgroundImage: `url("${locked}")`,
	// }

	return (
		<div
			style={style}
			className="size-[131px] rounded-[14px]  bg-center bg-cover bg-no-repeat cursor-pointer hover:rotate-[-10deg]"
			onClick={() => setPopup(obj)}
		>
			<div
				className={`${styles.locked} rounded-[14px]  bg-center bg-cover bg-no-repeat size-full hover:opacity-0`}
			></div>
		</div>
	);
}

function Info({ obj, setObj }) {
	return (
		<div className="size-full absolute z-[3] top-0 flex items-center justify-center backdrop-blur-[5px] max-[600px]:justify-start">
			<div className="w-[500px] max-[650px]:w-[80%] p-[20px] bg-[#343434] rounded-[25px] relative shadow-lg flex flex-col items-center">
				<svg
					onClick={() => setObj(false)}
					className="absolute top-[20px] right-[20px] cursor-pointer"
					width="20"
					height="20"
					viewBox="0 0 26 26"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M16.0807 13L25.3668 3.71137C26.2111 2.86695 26.2111 1.47774 25.3668 0.633316C24.5227 -0.211105 23.1338 -0.211105 22.2896 0.633316L13.0034 9.92195L3.7172 0.633316C2.873 -0.211105 1.48416 -0.211105 0.639958 0.633316C0.217858 1.05553 0 1.61393 0 2.17234C0 2.73075 0.217858 3.28916 0.639958 3.71137L9.92616 13L0.639958 22.2886C0.217858 22.7108 0 23.2693 0 23.8277C0 24.3861 0.217858 24.9445 0.639958 25.3667C1.48416 26.2111 2.873 26.2111 3.7172 25.3667L13.0034 16.0781L22.2896 25.3667C23.1338 26.2111 24.5227 26.2111 25.3668 25.3667C26.2111 24.5223 26.2111 23.1331 25.3668 22.2886L16.0807 13Z"
						fill="white"
						fillOpacity="0.29"
					/>
				</svg>
				<div className="flex gap-[10px] max-[500px]:flex-col max-[500px]:items-center">
					<img
						className="size-[131px] rounded-[15px]"
						src={obj.image}
						alt=""
					/>
					<div className="flex flex-col justify-center gap-[10px] max-[500px]:flex max-[500px]:flex-col max-[500px]:items-center">
						<h2 className="text-[#A3A3A3] text-[16px] font-semibold">
							name :{" "}
							<span className="text-white text-[16px] font-semibold">
								{obj.name}
							</span>
						</h2>
						<h2 className="text-[#A3A3A3] text-[16px] font-semibold">
							Definition:{" "}
							<span className="text-white text-[16px] font-semibold">
								{obj.definition}
							</span>
						</h2>
					</div>
				</div>
				<button className="w-[116px] h-[45px] rounded-[10px] bg-[#23A3BF] text-white text-[17px] font-bold cursor-pointer flex justify-center items-center">
					Buy {obj.price}
					{walletSvg}
				</button>
			</div>
		</div>
	);
}

export default function Padlles(props) {
	const navigate = useRouter();
	const [PaddlesObjs, setPaddlesObjs] = useState();
	const [popup, setPopup] = useState();

	useEffect(() => {
		createPadllesObj(setPaddlesObjs, navigate);
	}, []);

	return (
		<>
			{PaddlesObjs && (
				<div className="flex items-center justify-between pl-[20px] py-[10px] gap-[40px]">
					{PaddlesObjs.map((obj, index) => {
						return (
							<div key={index}>
								<Paddle obj={obj} setPopup={setPopup} />
							</div>
						);
					})}
					{popup && <Info obj={popup} setObj={setPopup} />}
				</div>
			)}
		</>
	);
}
