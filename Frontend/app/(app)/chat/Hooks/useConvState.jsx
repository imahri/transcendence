import { usePathname } from "next/navigation";
import { useState } from "react";

export const useConvState = () => {
	const [current_conv] = usePathname().split("/").slice(2, 4);
	console.log(current_conv);
	const [convState, setConvState] = useState(
		current_conv === undefined ? null : current_conv,
	);
	return [convState, setConvState];
};
