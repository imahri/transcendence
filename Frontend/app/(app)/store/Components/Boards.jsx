"use client";
import { useContext, useState, useEffect } from "react";
import common from "./styles/Common.module.css";
import { buyItem, walletSvg } from "./StoreItems";
import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import Loading from "@/app/(auth)/Loading";
import { UserContext } from "../../context";

function Board({ obj, owned, setOwned, setError }) {
	const isOwned = owned.includes(obj.id);
	const { setUpdate } = useContext(UserContext);
	const [show, setshow] = useState();
	const url = APIs.image(obj.image_path);
	const style = {
		backgroundImage: `url(${url})`,
	};

	return (
		<div className="flex flex-col items-center gap-[10px]">
			<div
				style={style}
				className="w-[360px] h-[202px] rounded-[10px] bg-center bg-cover bg-no-repeat cursor-pointer border border-solid border-white [@media(max-width:900px)]:w-[300px] [@media(max-width:900px)]:h-[174px]"
				onClick={() => setshow(!show)}
			>
				<div
					className={`${show || isOwned ? "hidden" : ""} ${common.locked} rounded-[10px]  bg-center bg-cover bg-no-repeat size-full hover:opacity-0`}
				></div>
			</div>
			<button
				className={`${show && !isOwned ? "" : "hidden"} w-[116px] h-[45px] rounded-[10px] bg-[#23A3BF] text-white text-[17px] font-bold cursor-pointer flex justify-center items-center`}
				onClick={() =>
					buyItem("boards", obj, setOwned, setError, setUpdate)
				}
			>
				Buy {obj.price}
				{walletSvg}
			</button>
		</div>
	);
}

function Boards({ setError }) {
	const [BoardsObjs, setBoardsObjs] = useState();
	const [ownedObjs, setOwnedObjs] = useState();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		const getItems = async () => {
			const [isOk, status, data] = await fetch_jwt(APIs.game.boards);

			if (isOk) {
				setBoardsObjs(data.boards);
				setOwnedObjs(data.owned);
				setLoading(false);
			}
		};
		getItems();
	}, []);

	return (
		<>
			{BoardsObjs && (
				<div className="flex pl-[20px] items-center gap-[30px]">
					{BoardsObjs.map((obj, index) => {
						return (
							<div key={index}>
								<Board
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

export default Boards;
