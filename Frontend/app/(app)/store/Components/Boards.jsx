"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import common from "./styles/Common.module.css";

import { walletSvg } from "./StoreItems";

import { getStoreItem } from "./StoreItems";
import { BOARDES_URL } from "../../../URLS";

function Board({ obj, index }) {
	const [show, setshow] = useState();

	const style = {
		backgroundImage: `url("${obj.image}")`,
	};
	return (
		<div key={index} className="flex flex-col items-center gap-[10px]">
			<div
				style={style}
				className="w-[360px] h-[202px] rounded-[10px] bg-center bg-cover bg-no-repeat cursor-pointer border border-solid border-white [@media(max-width:900px)]:w-[300px] [@media(max-width:900px)]:h-[174px]"
				onClick={() => {
					setshow(!show);
				}}
			>
				{!show && (
					<div
						className={`${common.locked} rounded-[10px]  bg-center bg-cover bg-no-repeat size-full hover:opacity-0`}
					></div>
				)}
			</div>
			{show && (
				<>
					<h3 className="text-[#A3A3A3] text-[20px] font-semibold">
						Name :{" "}
						<span className="text-white text-[20px] font-semibold">
							{obj.name}
						</span>
					</h3>
					<button className="w-[116px] h-[45px] rounded-[10px] bg-[#23A3BF] text-white text-[17px] font-bold cursor-pointer flex justify-center items-center">
						Buy {obj.price}
						{walletSvg}
					</button>
				</>
			)}
		</div>
	);
}

async function getItems(setBoardsObjs, navigate) {
	const data = await getStoreItem(BOARDES_URL, navigate);
	if (!data) return;
	setBoardsObjs(data);
}

function Boards() {
	const navigate = useRouter();
	const [BoardsObjs, setBoardsObjs] = useState();

	useEffect(() => {
		getItems(setBoardsObjs, navigate);
	}, []);

	return (
		<>
			{BoardsObjs && (
				<div className="flex py-[25px] pl-[20px] items-center gap-[30px]">
					{BoardsObjs.map((obj, index) => {
						return (
							<div key={index}>
								<Board obj={obj} index={index} />
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}

export default Boards;
