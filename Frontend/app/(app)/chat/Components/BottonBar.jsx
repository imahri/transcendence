"use client";
import { useRouter } from "next/navigation";
import { MicroProfile } from "./MicroProfile";
import { StartConversation } from "./StartConversation";

export const BottonBar = ({ user, setConvState, _Conversations }) => {
	const router = useRouter();

	return (
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
};
