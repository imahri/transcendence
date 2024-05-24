import { usePathname } from "next/navigation";
import { useState } from "react";

export const useConvState = () => {
	const path = usePathname();
	const [current_conv] = path.split("/").slice(2, 3);
	const [convState, setConvState] = useState(
		current_conv === undefined ? null : current_conv,
	);
	if (path === "/chat" && convState !== null) setConvState(null);
	else if (path !== "/chat" && convState === null) setConvState(current_conv);
	return [convState, setConvState];
};
