import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
import { Separator, Separators } from "./Separator";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";

export function SideBar() {
	return (
		<>
			<aside className={styles.sidebar}>
				<Searchbar style_ops="chat" />
				<Separator />
				<Conversations />
				<div className="bg-inherit w-full h-[10%]"></div>
			</aside>
			<Separators />
		</>
	);
}
