import Image from "next/image";
import Badge from "@/app/(app)/store/Components/Badge";
import { useEffect, useState } from "react";
import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { ITEMS_URL } from "@/app/URLS";
import Loading from "@/app/(auth)/Loading";
import Link from "next/link";

function Collection({ children, title }) {
	return (
		<div className="flex items-center gap-[50px] w-[80%] h-[250px] relative">
			<h1 className="text-[#868686] font-semibold text-[20px]">
				{title}
			</h1>
			{children}
		</div>
	);
}

function Paddles({ paddles, isLoading }) {
	return (
		<div
			className={`w-[80%] max-w-[80%] flex items-center gap-[20px] overflow-x-scroll p-[10px] ${!paddles ? "justify-center" : ""}`}
		>
			{paddles &&
				paddles.map((element, index) => {
					return (
						<Image
							key={index}
							src={element.image}
							width={90}
							height={90}
							className="size-[90px]"
							alt="paddles"
						/>
					);
				})}
			{isLoading && <Loading />}
			{!isLoading && !paddles && (
				<h1 className="text-white text-center text-[20px]">
					No Paddles{" "}
					<Link href="/store" className="text-blue-600">
						Go get it
					</Link>
				</h1>
			)}
		</div>
	);
}

function Boards({ boards, isLoading }) {
	return (
		<div
			className={`w-[80%] max-w-[80%] flex items-center gap-[20px] overflow-x-scroll p-[10px] ${!boards ? "justify-center" : ""}`}
		>
			{boards &&
				boards.map((element, index) => {
					return (
						<Image
							key={index}
							width={212}
							height={117}
							src={element.image}
							className="w-[212px] h-[117px]"
							alt="boards"
						/>
					);
				})}
			{isLoading && <Loading />}
			{!isLoading && !boards && (
				<h1 className="text-white text-center text-[20px]">
					No Boards{" "}
					<Link href="/store" className="text-blue-600">
						Go get it
					</Link>
				</h1>
			)}
		</div>
	);
}

function Badges({ badges, isLoading }) {
	return (
		<div
			className={`w-[80%] max-w-[80%] flex items-center overflow-x-scroll gap-[30px] p-[10px] ${!badges ? "justify-center" : ""}`}
		>
			{badges &&
				badges.map((obj, index) => {
					return (
						<div>
							{" "}
							<div
								className="w-[222px] h-[135px] relative"
								key={index}
							>
								{" "}
								<Badge BadgeInfo={obj} />{" "}
							</div>{" "}
						</div>
					);
				})}
			{isLoading && <Loading />}
			{!isLoading && !badges && (
				<h1 className="text-white text-center text-[20px]">
					No Badges{" "}
					<Link href="/store" className="text-blue-600">
						Go get it
					</Link>
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

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const [isOk, status, data] = await fetch_jwt(ITEMS_URL);
				setLoading(false);

				if (isOk) {
					setBoards(data.boards.owned_items);
					setPaddles(data.padels.owned_items);
					setBadges(data.badges.owned_items);
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
		<div className="w-[90%] h-[500px] flex flex-col gap-[20px]">
			<Collection title={"Paddle"} isLoading={isLoading}>
				<Paddles paddles={paddles} isLoading={isLoading} />
			</Collection>

			<Collection title={"Boards"}>
				<Boards boards={boards} isLoading={isLoading} />
			</Collection>

			<Collection title={"Badges"}>
				<Badges badges={badges} isLoading={isLoading} />
			</Collection>
		</div>
	);
}
