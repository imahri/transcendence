import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { useEffect, useState } from "react";

async function getConversations([offset, setOffset]) {
	const [isOk, status, data] = await fetch_jwt(APIs.chat.conversations, {
		offset: offset,
	});
	if (isOk) {
		!data.has_next ? setOffset(0) : setOffset(offset + 1);
		return data;
	} else if (status == 406) setOffset(0);
	return { conversations: [], size: 0, has_next: true };
}

async function getLastConversations(offset) {
	const [isOk, status, data] = await fetch_jwt(APIs.chat.conversations, {
		offset: offset,
		last: true,
	});
	if (isOk) return data;
	return null;
}

export const useConversations = (initialState) => {
	const [ConversationList, setConversationList] = useState(initialState);
	const [Offset, setOffset] = useState(2);
	const [getMore, setGetMore] = useState(false);
	const [isUpdated, setIsUpdated] = useState(false);
	const [ReplaceLast, setReplaceLast] = useState(false);

	useEffect(() => {
		setIsUpdated(true);
	}, []);

	useEffect(() => {
		if (ReplaceLast && Offset > 0) {
			getLastConversations(Offset - 1).then(
				(conversation) =>
					conversation &&
					setConversationList([...ConversationList, conversation]),
			);
			setReplaceLast(false);
		}
	}, [ReplaceLast]);

	useEffect(() => {
		if (getMore && Offset > 0) {
			getConversations([Offset, setOffset]).then(({ conversations }) => {
				setConversationList([...ConversationList, ...conversations]);
				if (ConversationList.length == 0) setIsUpdated(true);
			});
			setGetMore(false);
		}
	}, [getMore]);

	return {
		conversationList: ConversationList,
		addNewConversation: (conversation) => {
			setConversationList([conversation, ...ConversationList]);
			setIsUpdated(true);
		},
		setConversationList: setConversationList,
		isUpdatedState: [isUpdated, setIsUpdated],
		LoadMoreConversation: () => setGetMore(true),
		LoadToReplace: () => setReplaceLast(true),
	};
};
