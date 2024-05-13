"use client";
import { MicroProfile, StartConversation } from "./SideBar";

export const BottonBar = ({ user, setConvState, router, _Conversations }) => (
	<div className="w-full h-[7rem] flex justify-between py-4 px-12 ">
		<MicroProfile onClick={() => router.push("/profile")} user={user} />
		<StartConversation
			user={user}
			router={router}
			setStates={{
				setConvState: setConvState,
				convListState: [
					_Conversations.conversationList,
					_Conversations.addNewConversation,
				],
			}}
		/>
	</div>
);
