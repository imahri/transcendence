"use client";
import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
import { Separator, Separators } from "./Separator";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { WsChatContext } from "../context/context";
import { useContext, useRef } from "react";

function MicroProfile({ user }) {
	const router = useRouter();
	return (
		<button
			className="w-52 h-20 flex justify-start items-center text-slate-200"
			onClick={() => router.push("/profile")}
		>
			<Image
				className={"h-12 w-12 rounded-full mr-3"}
				src={user.info.profile_img}
				width={200}
				height={200}
				alt="profile image"
			/>
			<div className="flex flex-col items-start">
				<span className="font-semibold text-lg">
					{user.username.toUpperCase()}
				</span>
				<span className="font-normal text-gray-300 text-xs">{`${user.first_name} ${user.last_name}`}</span>
			</div>
		</button>
	);
}

const Add_icon = () => (
	<svg
		width="41"
		height="41"
		viewBox="0 0 41 41"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M20.5 2.5625C15.7605 2.62001 11.2314 4.52831 7.87986 7.87986C4.52831 11.2314 2.62001 15.7605 2.5625 20.5C2.62001 25.2395 4.52831 29.7686 7.87986 33.1201C11.2314 36.4717 15.7605 38.38 20.5 38.4375C25.2395 38.38 29.7686 36.4717 33.1201 33.1201C36.4717 29.7686 38.38 25.2395 38.4375 20.5C38.38 15.7605 36.4717 11.2314 33.1201 7.87986C29.7686 4.52831 25.2395 2.62001 20.5 2.5625ZM30.75 21.7812H21.7812V30.75H19.2188V21.7812H10.25V19.2188H19.2188V10.25H21.7812V19.2188H30.75V21.7812Z"
			fill="#939393"
		/>
	</svg>
);

function StartConversation() {
	const _ref = useRef();
	const handleScale = () =>
		_ref.current.classList.value.match("scale-100") === null
			? _ref.current.classList.add("scale-100")
			: _ref.current.classList.remove("scale-100");

	return (
		<button className="group" onClick={handleScale}>
			<Add_icon />
			<div
				ref={_ref}
				className="absolute bottom-20 w-[20rem] h-[33rem] bg-[#434343] rounded-3xl  transition-all duration-75 scale-0 origin-bottom-left"
			></div>
		</button>
	);
}

export function SideBar() {
	const showSideBar = usePathname() === "/chat";
	const { user, socket, data } = useContext(WsChatContext);
	return (
		<>
			<aside
				className={`${showSideBar ? styles.sidebar : styles.sidebar_h}`}
			>
				<Searchbar style_ops="chat" />
				<Separator className={"w-72 h-1"} />
				<Conversations />
				<div className="w-full h-[7rem] flex justify-between py-4 px-12 ">
					<MicroProfile user={user} />
					<StartConversation />
				</div>
			</aside>
			<Separators />
		</>
	);
}
