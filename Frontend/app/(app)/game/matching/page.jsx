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
