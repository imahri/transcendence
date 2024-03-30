export function getCurrentTime() {
	const date = new Date();
	return date.toString();
}

export function ToHour12Time(time) {
	let date = new Date(time);
	return date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
}
