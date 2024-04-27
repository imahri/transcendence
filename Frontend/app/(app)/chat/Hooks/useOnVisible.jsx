import { useEffect, useState } from "react";

export const useOnVisible = (ref) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (ref.current == null) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIsVisible(entry.isIntersecting),
		);
		observer.observe(ref.current);
		return () => {
			if (ref.current == null) return;
			observer.unobserve(ref.current);
		};
	}, [ref.current]);

	return isVisible;
};
