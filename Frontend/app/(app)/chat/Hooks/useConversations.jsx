import { APIs, fetch_jwt } from "@/Tools/fetch_jwt_client";

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

export const useConversations = () => {
	const [ConversationList, setConversationList] = useState([]);
	const [Offset, setOffset] = useState(1);
	const [getMore, setGetMore] = useState(true);
	const [isUpdated, setIsUpdated] = useState(false);

	useEffect(() => {
		setIsUpdated(true);
	}, []);

	useEffect(() => {
		if (getMore && Offset > 0) {
			getConversations([Offset, setOffset]).then(({ conversations }) => {
				setConversationList([...ConversationList, ...conversations]);
				if (messageList.length == 0) setIsUpdated(true);
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
		isUpdatedState: [isUpdated, setIsUpdated],
		LoadMoreConversation: () => setGetMore(true),
	};
};
