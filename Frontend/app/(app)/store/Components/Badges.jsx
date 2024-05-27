"use client";
import { useState, useEffect } from "react";
import Badge from "./Badge";
import common from "./styles/Common.module.css";
import { BADGES_URL } from "../../../URLS";
import { buyItem, walletSvg } from "./StoreItems";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import Loading from "@/app/(auth)/Loading";

function BadgeItem({ obj, owned, setOwned, setError }) {
	const [show, setshow] = useState();
	const isOwned = owned.includes(obj.id);

	return (
		<div className="flex flex-col items-center gap-[10px]">
			<div
				className="w-[360px] h-[202px] relative cursor-pointer [@media(max-width:900px)]:w-[300px] [@media(max-width:900px)]:h-[174px]"
				onClick={() => setshow(!show)}
			>
				<Badge BadgeInfo={obj} />
				<div
					className={`${show || isOwned ? "hidden" : ""} ${common.locked} rounded-[14px]  bg-center bg-cover bg-no-repeat size-full hover:opacity-0 absolute top-0`}
				></div>
			</div>
			<button
				className={`${show && !isOwned ? "" : "hidden"} w-[116px] h-[45px] rounded-[10px] bg-[#23A3BF] text-white text-[17px] font-bold cursor-pointer flex justify-center items-center`}
				onClick={() => buyItem("badges", obj, setOwned, setError)}
			>
				Buy {obj.price}
				{walletSvg}
			</button>
		</div>
	);
}

function Badges({ setError }) {
	const [BadgeObjs, setBadgesObjs] = useState();
	const [ownedObjs, setOwnedObjs] = useState();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		const getItems = async () => {
			const [isOk, status, data] = await fetch_jwt(BADGES_URL);

			if (isOk) {
				setBadgesObjs(data.badges);
				setOwnedObjs(data.owned);
				setLoading(false);
			}
		};
		getItems();
	}, []);

	return (
		<>
			{BadgeObjs && (
				<div className="flex items-center gap-[30px] pl-[20px]">
					{BadgeObjs.map((obj, index) => {
						return (
							<div key={index}>
								<BadgeItem
									obj={obj}
									owned={ownedObjs}
									setError={setError}
									setOwned={setOwnedObjs}
								/>
							</div>
						);
					})}
				</div>
			)}
			{isLoading && <Loading />}
		</>
	);
}

export default Badges;
