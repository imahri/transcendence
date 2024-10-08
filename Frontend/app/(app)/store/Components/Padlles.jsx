"use client";
import { useContext, useEffect, useState } from "react";
import { buyItem, walletSvg } from "./StoreItems";
import styles from "./styles/Common.module.css";
import Loading from "@/app/(auth)/Loading";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { UserContext } from "../../context";

function Paddle({ obj, owned, setOwned, setError }) {
	const { setUpdate } = useContext(UserContext);
	const isOwned = owned.includes(obj.id);
	const [show, setShow] = useState();
	const url = APIs.image(obj.image_path);
	const style = {
		backgroundImage: `url(${url})`,
	};

	return (
		<div className="flex flex-col items-center gap-[10px]">
			<div
				style={style}
				className="size-[131px] rounded-[14px]  bg-center bg-cover bg-no-repeat cursor-pointer"
				onClick={() => {
					setShow(!show);
				}}
			>
				<div
					className={`${show || isOwned ? "hidden" : ""}${styles.locked} rounded-[14px]  bg-center bg-cover bg-no-repeat size-full hover:opacity-0`}
				></div>
			</div>
			<button
				className={`${show && !isOwned ? "" : "hidden"} w-[116px] h-[45px] rounded-[10px] bg-[#23A3BF] text-white text-[17px] font-bold cursor-pointer flex justify-center items-center`}
				onClick={() =>
					buyItem("padels", obj, setOwned, setError, setUpdate)
				}
			>
				Buy {obj.price}
				{walletSvg}
			</button>
		</div>
	);
}

export default function Padlles({ setError }) {
	const [PaddlesObjs, setPaddlesObjs] = useState();
	const [ownedObjs, setOwnedObjs] = useState();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		const getItems = async () => {
			const [isOk, status, data] = await fetch_jwt(APIs.game.paddles);
			if (isOk) {
				setPaddlesObjs(data.paddles);
				setOwnedObjs(data.owned);
				setLoading(false);
			}
		};
		getItems();
	}, []);

	return (
		<>
			{PaddlesObjs && (
				<div className="flex items-center justify-between pl-[20px] gap-[40px]">
					{PaddlesObjs.map((obj, index) => {
						return (
							<div key={index}>
								<Paddle
									obj={obj}
									owned={ownedObjs}
									setOwned={setOwnedObjs}
									setError={setError}
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
