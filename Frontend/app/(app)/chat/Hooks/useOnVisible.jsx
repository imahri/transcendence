import { useEffect, useState } from "react";

export const useOnVisible = (ref) => {
	const [isVisible, setIsVisible] = useState(false);

	// ./app/(app)/chat/Hooks/useOnVisible.jsx
	// 14:27  Warning: The ref value 'ref.current' will likely have changed by the time this effect cleanup function runs. If this ref points to a node rendered by React, copy 'ref.current' to a variable inside the effect, and use that variable in the cleanup function.  react-hooks/exhaustive-deps
	// 16:5  Warning: React Hook useEffect has a missing dependency: 'ref'. Either include it or remove the dependency array. Mutable values like 'ref.current' aren't valid dependencies because mutating them doesn't re-render the component.  react-hooks/exhaustive-deps

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
