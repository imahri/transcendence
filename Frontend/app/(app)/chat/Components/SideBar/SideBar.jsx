import { useState } from "react";
import { Searchbar } from '@/app/(app)/searchBar/Searchbar';
// import Searchbar from "../../../searchBar/Searchbar";
import Separator from "./Separator";
import ConversationType from "./ConversationType";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";

const conversation_types = ["Friends", "Groups"];

export default function SideBar({ convState }) {
	const [active_type, setActiveType] = useState(conversation_types[0]);

	// set lastMsgTime for all users

	return (
		<aside className={styles.sidebar}>
			<Searchbar />
			<Separator />
			<ConversationType
				active_type={active_type}
				setActiveType={setActiveType}
			/>
			<Conversations type={active_type} convState={convState} />
			{/* <div className="bg-red-800 w-full h-[10%]"></div> */}
		</aside>
	);
}
