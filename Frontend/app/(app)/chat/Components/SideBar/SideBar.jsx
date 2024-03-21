import { useContext, useState } from "react";
import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
// import Searchbar from "../../../searchBar/Searchbar";
import Separator from "./Separator";
import ConversationType from "./ConversationType";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";
import { ConvChatContext } from "../../context/context";

const conversation_types = ["Friends", "Groups"];

export default function SideBar({ convState }) {
	const [convType, setConvType] = useState(conversation_types[0]);

	// set lastMsgTime for all users

	return (
		<ConvChatContext.Provider value={[convType, setConvType]}>
			<aside className={styles.sidebar}>
				<Searchbar />
				<Separator />
				<ConversationType />
				<Conversations type={convType} convState={convState} />
				{/* <div className="bg-red-800 w-full h-[10%]"></div> */}
			</aside>
		</ConvChatContext.Provider>
	);
}
