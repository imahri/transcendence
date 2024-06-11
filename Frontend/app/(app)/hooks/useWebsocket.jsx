"use client";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { useEffect, useState } from "react";

function init_socket(endpoint, query_params) {
	const url = query_params
		? endpoint + `?token=${getToken()}&${new URLSearchParams(query_params)}`
		: endpoint + `?token=${getToken()}`;
	return new WebSocket(url);
}

export const useWebsocket = (endpoint, query_params = null) => {
	const [isReady, setIsReady] = useState(false);
	const [socket, setSocket] = useState(() =>
		init_socket(endpoint, query_params),
	);

	useEffect(() => {
		if (!socket) return;
		socket.onopen = () => {
			setIsReady(true);
		};
		return () => socket.close();
	}, [socket]);

	return [socket, socket.readyState == socket.OPEN];
};
