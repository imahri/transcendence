import { usePathname } from "next/navigation";
import { useState } from "react";

export const useConvState = () => {
	const path = usePathname();
	const [current_conv] = path.split("/").slice(2, 3);
	const [convState, setConvState] = useState(
		current_conv === undefined ? null : current_conv,
	);
	if (path === "/chat" && convState !== null) {
		console.log("----->", current_conv, path);
		setConvState(null);
	} // TODO: Fix this state when click first time in conv the state not change
	return [convState, setConvState];
};
