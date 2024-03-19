import React from "react";

import styles from "./styles/Separator.module.css";

export default function Separator({ className }) {
	const classes = [styles.separator, className];
	return <hr className={classes.join(" ")} />;
}
