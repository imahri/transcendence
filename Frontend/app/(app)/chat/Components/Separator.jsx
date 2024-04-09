import React from "react";

export function Separator({ className }) {
	return (
		<div
			className={`m-0 min-h-1 border-none rounded bg-[#303030] ${className}`}
		></div>
	);
}

export function Separators() {
	return (
		<div className="h-screen w-1 flex flex-col justify-start">
			<Separator className="w-1 h-5 bg-transparent" />
			<Separator className="w-1 h-16" />
			<Separator className="w-1 h-16 bg-transparent" />
			<Separator className="w-1 flex-grow" />
			<Separator className="w-1 h-28 bg-transparent" />
		</div>
	);
}
