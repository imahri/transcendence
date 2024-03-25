function getCurrentTime() {
	let date = new Date();
	return date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
}
