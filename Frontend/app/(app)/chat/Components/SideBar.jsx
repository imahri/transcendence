import { Searchbar } from "@/app/(app)/searchBar/Searchbar";
import { Separator, Separators } from "./Separator";
import Conversations from "./Conversations";
import styles from "./styles/SideBar.module.css";

export function SideBar() {
	return (
		<>
			<aside className={styles.sidebar}>
				<Searchbar style_ops="chat" />
				<Separator className={"w-72 h-1"} />
				<Conversations />
				<div className="w-full h-[10%] xs:bg-[#FF0000] sm:bg-[#FF6633] md:bg-[#FF9900] lg:bg-[#FFFF00] xl:bg-[#C2C2F0] 2xl:bg-[#E0E0E0]"></div>
			</aside>
			<Separators />
		</>
	);
}
