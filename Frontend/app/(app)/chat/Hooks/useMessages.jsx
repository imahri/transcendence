import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";
import { useState, useEffect } from "react";

async function getMessages(conversation_id, [offset, setOffset]) {
	if (conversation_id != 0) {
		const [isOk, status, data] = await fetch_jwt(APIs.chat.messages, {
			conversation: conversation_id,
			offset: offset,
		});
		if (isOk) {
			!data.has_next ? setOffset(0) : setOffset(offset + 1);
			return data;
		} else if (status == 406) setOffset(0);
	}
	return { messages: [], size: 0, has_next: true };
}

export const useMessageList = (conversation_id, setmessageUpdated) => {
	const [messageList, setMessageList] = useState([]);
	const [Offset, setOffset] = useState(1);
	const [getMore, setGetMore] = useState(true);
	const [isUpdated, setIsUpdated] = useState(false);

	useEffect(() => {
		setIsUpdated(true);
	}, []);

	useEffect(() => {
		if (getMore && Offset > 0 && conversation_id > 0) {
			getMessages(conversation_id, [Offset, setOffset]).then(
				({ messages }) => {
					setMessageList([...messageList, ...messages]);
					if (messageList.length == 0) setIsUpdated(true);
				},
			);
			setGetMore(false);
		}
	}, [getMore, conversation_id]);

	return {
		messageList: messageList,
		addNewMessage: (newMsg) => {
			setMessageList([newMsg, ...messageList]);
			setIsUpdated(true);
			setmessageUpdated(true);
		},
		isUpdatedState: [isUpdated, setIsUpdated],
		LoadMoreMessages: () => setGetMore(true),
	};
};
