import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { useEffect, useRef, useState } from "react";
import { MicroProfileFriend } from "./MicroProfile";

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

export function StartConversation({
	router,
	setStates: {
		setConvState,
		convListState: [convList, addNewConversation],
	},
}) {
	const [friendList, setFriendList] = useState([]);
	const [visible, setVisible] = useState(false);
	const _ref = useRef();

	useEffect(() => {
		if (visible)
			// TODO: use route handler
			fetch_jwt(APIs.user.friends).then(([isOk, status, data]) => {
				if (isOk) setFriendList(data);
				_ref.current.classList.toggle("h-[10rem]", !isOk);
				_ref.current.classList.toggle("h-[33rem]", isOk);
			});
		_ref.current.classList.toggle("scale-100", visible);
	}, [visible]);

	const getConversation = async (friend) => {
		// TODO: use route handler
		const [isOk, status, data] = await fetch_jwt(
			`${APIs.chat.conversations}/${friend}`,
		);
		if (!isOk) router.push("/chat");
		return data;
	};

	const onStartConv = (friend) => {
		if (convList && !convList.some((conv) => conv.name === friend.username))
			getConversation(friend.username).then((conv) =>
				addNewConversation(conv),
			);
		router.push(`/chat/${friend.username}`);
		setConvState(friend.username);
	};

	return (
		<>
			<button onClick={() => setVisible(!visible)}>
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
