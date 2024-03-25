import { usePathname } from "next/navigation";
import { useState } from "react";

export const useConvState = () => {
	const [type, current_conv] = usePathname().split("/").slice(2, 4);
	const [convState, setConvState] = useState({
		type: type === undefined ? "Friends" : type,
		current_conv: current_conv === undefined ? null : current_conv,
	});
	return [convState, setConvState];
};
