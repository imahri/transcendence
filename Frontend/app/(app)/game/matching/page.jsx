"use client";
// import Image from "next/image";
import Matching from "@/app/(app)/game/matching/components/match_making/matching";
import LGame from "@/app/(app)/game/matching/gcomponents/live_game/Livegame";
import { Provider } from "@/app/(app)/context/Context";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";

const Vim = () => {
	// const {socket_, setSocket} = Provider()
	// const [ready, setReady] = useState()
	// //init socket
	// useEffect(() => {
	// 	const ws = new WebSocket(
	// 		"ws://10.12.5.7:8000/ws/game?" + `token=${getToken()}`,
	// 	);
	// 	ws.onopen = () => {
	// 		console.log("opened");
	// 		setSocket(ws);
	// 	};

	// 	ws.addEventListener('message', (event) => {
	// 		const data = JSON.parse(event.data)
	// 		// console.log('first msg', data);
	// 		// if (data.event == 'change_state' && data.state == 'start')
	// 		// 	setReady(true)
	// 		// if (data.event == "index_player"){
	// 		// 	console.log("please")
	// 		// 	console.log(">>>>  ", data.index);
	// 		// }
	// 	});

	// 	ws.onclose = () => {
	// 		console.log("closed");
	// 	};
	// 	return () => {
	// 		ws.close;
	// 	};

	// }, [])
	const [loading, setLoading] = useState(true);
	const secondArrived = () => {
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};
	return (
		<div>
			{<LGame secondArrived={secondArrived} loading={loading} />}
			{loading && <Matching />}
		</div>
	);
};

export default Vim;
