import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useConversationID = (FriendName) => {
	const router = useRouter();
	const [conversationID, setConversationID] = useState(0);

	useEffect(() => {
		// TODO: use route handler
		fetch_jwt(
			APIs.chat.conversations,
			{ FriendName: FriendName },
			{ method: "OPTIONS" },
		).then(([isOk, status, data]) => {
			isOk
				? setConversationID(data.conversation_id)
				: router.replace(`/chat?remove_conv=${FriendName}`);
		});
	}, [FriendName]);
	return conversationID;
};

export default useConversationID;
