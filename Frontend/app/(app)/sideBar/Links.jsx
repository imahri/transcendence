import {
	LinkSvg,
	HomePath,
	ChatPath,
	GamePath,
	StorePath,
	RankPath,
	settingsPath,
} from "./Icons";

import Link from "next/link";
import { usePathname } from "next/navigation";

function borderLeft() {
	return (
		<div className="h-[30px] border border-l-3 border-purple-600 top-[-2px] left-[-23px] absolute max-[900px]:border-0  max-[900px]:border-b-[3px] max-[900px]:top-0 max-[900px]:left-[-5px] max-[900px]:w-[38px]"></div>
	);
}

function Links(props) {
	const active = usePathname();
	const showSettings = props.showSettings;

	const Home = active.includes("/home");
	const Chat = active.includes("/chat");
	const Game = active.includes("/game");
	const Store = active.includes("/store");
	const Rank = active.includes("/rank");

	return (
		<>
			<li className="h-full grid justify-center max-[900px]:w-full max-[900px]:flex max-[900px]:justify-between">
				<ul className="relative m-[20px] flex justify-center cursor-pointer">
					<Link href="/home">
						{Home && borderLeft()}
						{LinkSvg(HomePath(Home), 20, 21)}
					</Link>
				</ul>

				<ul className="relative m-[20px] flex justify-center cursor-pointer">
					<Link href="/chat">
						{Chat && borderLeft()}
						{LinkSvg(ChatPath(Chat), 20, 21)}
					</Link>
				</ul>
				<ul className="relative m-[20px] flex justify-center cursor-pointer">
					<Link href="/game">
						{Game && borderLeft()}
						{LinkSvg(GamePath(Game), 28, 20)}
					</Link>
				</ul>
				<ul className="relative m-[20px] flex justify-center cursor-pointer">
					<Link href="/store">
						{Store && borderLeft()}
						{LinkSvg(StorePath(Store), 20, 21)}
					</Link>
				</ul>
				<ul className="relative m-[20px] flex justify-center cursor-pointer">
					<Link href="/rank">
						{Rank && borderLeft()}
						{LinkSvg(RankPath(Rank), 28, 20)}
					</Link>
				</ul>
				<div
					onClick={() => showSettings(true)}
					className="absolute bottom-[20px] w-[100%] flex justify-center cursor-pointer max-[900px]:relative max-[900px]:bottom-0 max-[900px]:w-[30px] max-[900px]:items-center"
				>
					{LinkSvg(settingsPath(), 20, 21)}
				</div>
			</li>
		</>
	);
}

export default Links;
