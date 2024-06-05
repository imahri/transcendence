"use client";
import { useEffect, useState } from "react";

function init_socket(endpoint, query_params) {
	const url = query_params
		? endpoint + `?token=${getToken()}&${new URLSearchParams(query_params)}`
		: endpoint + `?token=${getToken()}`;
	return new WebSocket(url);
}

export const useWebsocket = (endpoint, query_params = null) => {
	const [socket, setSocket] = useState(() =>
		init_socket(endpoint, query_params),
	);

	useEffect(() => {
		if (!socket) return;
		socket.onopen = () => console.log(`Connected with ${endpoint}`);
		socket.onerror = () => console.log(`Error in ${endpoint}`);
		socket.onclose = () => console.log(`Disconnected with ${endpoint}`);
		return () => socket.close();
	}, [socket]);

	return socket;
};
