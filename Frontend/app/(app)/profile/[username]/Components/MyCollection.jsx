import Image from "next/image";
import Badge from "@/app/(app)/store/Components/Badge";
import { useContext, useEffect, useState } from "react";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { ITEMS_URL } from "@/app/URLS";
import Loading from "@/app/(auth)/Loading";
import { UserProfileContext } from "../page";

async function equipItem(item_id, items_id, setter) {
	const body = { action: "equip", item_id: item_id, items_id: items_id };
	const [isOk, status, data] = await fetch_jwt(
		ITEMS_URL,
		{},
		{
			method: "PUT",
			body: JSON.stringify(body),
			headers: { "Content-Type": "application/json" },
		},
	);
	if (isOk) {
		console.log(data);
		setter(data);
	}
}

function Collection({ children, title }) {
	return (
		<div className="flex items-center gap-[50px] w-full h-[200px] relative md:flex-col sm:flex-col xs:flex-col md:gap-0 sm:gap-0 xs:gap-0">
			<h1 className="text-[#868686] font-semibold text-[20px]">
				{title}
			</h1>
			<div className="w-[80%] md:w-full sm:w-full xs:w-full">
				{children}
			</div>
		</div>
	);
}

function Paddles({ paddles, setPaddles, isLoading }) {
	const userProfile = useContext(UserProfileContext);

	return (
		<div
			className={`w-full flex items-center gap-[30px] overflow-x-scroll p-[10px] ${!paddles ? "justify-center" : ""}`}
		>
			{paddles &&
				paddles.owned_items.map((element, index) => {
					return (
						<div>
							<div
								key={index}
								className="relative size-[120px] rounded-[7px] bg-[#00FFE0] bg-opacity-[10%] flex justify-center items-center"
							>
								<Image
									src={element.image}
									width={90}
									height={90}
									className="size-[90px] border-2 border-black cursor-pointer hover:size-full"
									alt="paddles"
									onClick={
										userProfile.friendship == "owner"
											? () =>
													equipItem(
														element.id,
														paddles.id,
														setPaddles,
													)
											: null
									}
								/>
								{paddles.current_item.id == element.id && (
									<div className="text-white bg-[#262626] font-bold text-[15px] p-[5px] rounded-[5px] absolute">
										Equiped
									</div>
								)}
							</div>
						</div>
					);
				})}
			{isLoading && <Loading />}
			{!isLoading && !paddles && (
				<h1 className="text-white text-center text-[20px]">
					No Paddles
				</h1>
			)}
		</div>
	);
}

function Boards({ boards, setBoards, isLoading }) {
	const userProfile = useContext(UserProfileContext);

	return (
		<div
			className={`w-full flex items-center gap-[30px] overflow-x-scroll p-[10px] ${!boards ? "justify-center" : ""}`}
		>
			{boards &&
				boards.owned_items.map((element, index) => {
					return (
						<div>
							<div
								key={index}
								className="relative w-[250px] h-[150px] rounded-[10px] bg-[#2846E6] bg-opacity-[19%] flex justify-center items-center backdrop-blur-sm"
							>
								<Image
									width={212}
									height={117}
									src={element.image}
									className="w-[212px] h-[117px] cursor-pointer hover:w-[100%] hover:h-[100%]"
									alt="boards"
									onClick={
										userProfile.friendship == "owner"
											? () =>
													equipItem(
														element.id,
														boards.id,
														setBoards,
													)
											: null
									}
								/>
								{boards.current_item.id == element.id && (
									<div className="text-white bg-[#262626] font-bold text-[15px] p-[5px] rounded-[5px] absolute">
										Equiped
									</div>
								)}
							</div>
						</div>
					);
				})}
			{isLoading && <Loading />}
			{!isLoading && !boards && (
				<h1 className="text-white text-center text-[20px]">
					No Boards
				</h1>
			)}
		</div>
	);
}

function Badges({ badges, setBadges, isLoading }) {
	const userProfile = useContext(UserProfileContext);

	return (
		<div
			className={`w-full flex items-center overflow-x-scroll gap-[30px] p-[10px] ${!badges ? "justify-center" : ""}`}
		>
			{badges &&
				badges.owned_items.map((obj, index) => {
					return (
						<div>
							<div
								key={index}
								className="relative w-[260px] h-[160px] bg-[#E628C7] bg-opacity-[20%] flex justify-center items-center rounded-[20px]"
							>
								<div
									className="w-[222px] h-[135px] relative cursor-pointer hover:size-full"
									onClick={
										userProfile.friendship == "owner"
											? () =>
													equipItem(
														obj.id,
														badges.id,
														setBadges,
													)
											: null
									}
								>
									<Badge BadgeInfo={obj} />
								</div>
								{badges.current_item.id == obj.id && (
									<div className="text-white bg-[#262626] font-bold text-[15px] p-[5px] rounded-[5px] absolute">
										Equiped
									</div>
								)}
							</div>
						</div>
					);
				})}
			{isLoading && <Loading />}
			{!isLoading && !badges && (
				<h1 className="text-white text-center text-[20px]">
					No Badges
				</h1>
			)}
		</div>
	);
}

export default function MyCollection() {
	const [isLoading, setLoading] = useState(true);
	const [paddles, setPaddles] = useState();
	const [badges, setBadges] = useState();
	const [boards, setBoards] = useState();

	const userProfile = useContext(UserProfileContext);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const [isOk, status, data] = await fetch_jwt(ITEMS_URL, {
					username: userProfile.username,
				});
				setLoading(false);

				if (isOk) {
					setBoards(data.boards);
					setPaddles(data.padels);
					setBadges(data.badges);
				} else {
					console.log(data);
				}
			} catch (error) {
				console.log("error : ", error);
			}
		};

		fetchItems();
	}, []);

	return (
		<div className="w-[80vw] flex flex-col gap-[20px]">
			<Collection title={"Paddle"} isLoading={isLoading}>
				<Paddles
					paddles={paddles}
					setPaddles={setPaddles}
					isLoading={isLoading}
				/>
			</Collection>

			<Collection title={"Boards"}>
				<Boards
					boards={boards}
					setBoards={setBoards}
					isLoading={isLoading}
				/>
			</Collection>

			<Collection title={"Badges"}>
				<Badges
					badges={badges}
					setBadges={setBadges}
					isLoading={isLoading}
				/>
			</Collection>
		</div>
	);
}
