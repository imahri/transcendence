"use client";
import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
import { Separator, Separators } from "./Separator";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { WsChatContext } from "../context/context";
import { useContext, useEffect, useRef, useState } from "react";
import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { useConvState } from "../Hooks/useConvState";

const MicroProfile = ({ onClick, user }) => (
	<button
		className="w-52 h-20 flex justify-start items-center text-slate-200"
		onClick={onClick}
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

const MicroProfileFriend = ({ onClick, friend }) => (
	<button
		className="w-52 h-20 flex justify-center items-center text-slate-200 my-3"
		onClick={onClick}
	>
		<Image
			className={"h-10 w-10 rounded-full mr-3"}
			src={friend.img}
			width={200}
			height={200}
			alt="profile image"
		/>
		<div className="flex flex-col items-start">
			<span className="font-semibold text-md">{friend.username}</span>
			<span className="font-normal text-gray-300 text-xs">{`${friend.first_name} ${friend.last_name}`}</span>
		</div>
	</button>
);

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

function StartConversation({
	router,
	setStates: {
		setConvState,
		convListState: [convList, setConvList],
	},
}) {
	const [friendList, setFriendList] = useState([]);
	const [visible, setVisible] = useState(false);
	const _ref = useRef();
	const handleScale = () => {
		visible
			? _ref.current.classList.remove("scale-100")
			: _ref.current.classList.add("scale-100");
		setVisible(!visible);
	};

	useEffect(() => {
		if (visible) {
			const get_friends = async () => {
				const [isOk, status, data] = await fetch_jwt(APIs.user.friends);
				if (!isOk) {
					if (status == 404) setFriendList([]);
					console.log("==> ", status);
					return;
				}
				setFriendList(data);
			};
			get_friends();
		}
	}, [visible]);

	const getConversation = async (friend) => {
		const [isOk, status, data] = await fetch_jwt(
			`${APIs.chat.conversations}/${friend}`,
		);
		if (!isOk) router.push("/chat");
		return data;
	};

	const onStartConv = (friend) => {
		if (
			convList &&
			!convList.some((conv) => conv.name === friend.username)
		) {
			router.push(`/chat/${friend.username}`);
			setConvState(friend.username);
			getConversation(friend.username).then((conv) =>
				setConvList([conv, ...convList]),
			);
		}
	};

	useEffect(() => {
		// TODO: change it to className directly
		if (friendList.length == 0) _ref.current.classList.add("h-[10rem]");
		else _ref.current.classList.remove("h-[10rem]");
	}, [friendList]);

	return (
		<>
			<button onClick={handleScale}>
				<Add_icon />
			</button>
			<div
				ref={_ref}
				className="absolute left-[22rem] bottom-20 w-[15rem] h-[33rem] bg-[#222222] rounded-3xl  transition-all duration-75 scale-0 origin-bottom
				flex flex-col items-center justify-start overflow-y-scroll scrollbar-hide
				"
			>
				{friendList.length == 0 ? (
					<div className="w-52 h-20 flex justify-center items-center text-slate-200 my-3">
						<span className="font-normal text-gray-300 text-1xl">
							No Result
						</span>
					</div>
				) : (
					friendList.map((friend, idx) => (
						<MicroProfileFriend
							key={idx}
							friend={friend}
							onClick={() => onStartConv(friend)}
						/>
					))
				)}
			</div>
		</>
	);
}

export function SideBar() {
	const { user, socket, data } = useContext(WsChatContext);
	const [convState, setConvState] = useConvState();
	const [convList, setConvList] = useState(data.conversations);
	const [convListOffset, setConvListOffset] = useState(2);
	const router = useRouter();
	const showSideBar = usePathname() === "/chat";

	return (
		<>
			<aside
				className={`${showSideBar ? styles.sidebar : styles.sidebar_h}`}
			>
				<Searchbar style_ops="chat" />
				<Separator className={"w-72 h-1"} />
				<Conversations
					_convState={[convState, setConvState]}
					_convList={[convList, setConvList]}
					_convListOffset={[convListOffset, setConvListOffset]}
				/>
				<div className="w-full h-[7rem] flex justify-between py-4 px-12 ">
					<MicroProfile
						onClick={() => router.push("/profile")}
						user={user}
					/>
					<StartConversation
						user={user}
						router={router}
						setStates={{
							setConvState,
							convListState: [convList, setConvList],
						}}
					/>
				</div>
			</aside>
			<Separators />
		</>
	);
}
