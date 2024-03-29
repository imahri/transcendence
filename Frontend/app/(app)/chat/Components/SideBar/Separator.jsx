import React from "react";

import styles from "./styles/Separator.module.css";

export function Separator({ className }) {
	const classes = [styles.separator, className];
	return <div className={classes.join(" ")} />;
}

export function Separators() {
	return (
		<div className="w-1 h-[90%] flex flex-col justify-between">
			<Separator className="w-1 h-[7%] rotate-0" />
			<Separator className="w-1 h-[83%] rotate-0" />
		</div>
	);
}
