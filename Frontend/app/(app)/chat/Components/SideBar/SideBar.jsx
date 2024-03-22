import { useState } from "react";
import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
import Separator from "./Separator";
import ConversationType from "./ConversationType";
import styles from "./styles/SideBar.module.css";
import { ConvTypeChatContext } from "../../context/context";
import Conversations from "./Conversations";

const conversation_types = ["Friends", "Groups"];

export default function SideBar() {
	const [convType, setConvType] = useState(conversation_types[0]);

	return (
		<ConvTypeChatContext.Provider value={[convType, setConvType]}>
			<aside className={styles.sidebar}>
				<Searchbar />
				<Separator />
				<ConversationType />
				<Conversations type={convType} />
				{/* <div className="bg-red-800 w-full h-[10%]"></div> */}
			</aside>
		</ConvTypeChatContext.Provider>
	);
}
