"use client";
import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
import { Separator, Separators } from "./Separator";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { WsChatContext } from "../context/context";
import { useContext } from "react";

function MicroProfile({ user }) {
	return (
		<div className="w-full h-20 flex justify-start items-center text-white">
			<Image
				className={"h-12 w-12 rounded-full mr-3"}
				src={user.info.profile_img}
				width={200}
				height={200}
				alt="profile image"
			/>
			<div className="flex flex-col">
				<span className="font-semibold text-xl">
					{user.username.toUpperCase()}
				</span>
				<span className="font-light text-sm">{`${user.first_name} ${user.last_name}`}</span>
			</div>
		</div>
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
	return (
		<button>
			<Add_icon />
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
				<div className="w-full h-[7rem] flex py-4 px-12 ">
					<MicroProfile user={user} />
					<StartConversation />
				</div>
			</aside>
			<Separators />
		</>
	);
}
