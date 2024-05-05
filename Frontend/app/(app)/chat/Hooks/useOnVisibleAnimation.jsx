import { useEffect } from "react";

export const useOnVisibleAnimation = (
	ContainerRef,
	classNameOnshow,
	deps,
	threshold = 0.4,
) => {
	useEffect(() => {
		const entries = [...ContainerRef.current.children];
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) =>
					entry.target.classList.toggle(
						classNameOnshow,
						entry.isIntersecting,
					),
				),
			{
				threshold: threshold,
			},
		);
		entries.forEach((entry) => observer.observe(entry));
	}, deps);
};
