"use client";

import React, { useEffect } from "react";
import { Provider } from "@/app/(app)/context/Context";

const page = () => {
	const { socket_, setSocket } = Provider();

	useEffect(() => {
		console.log(socket_);
	}, []);
	return <div>page</div>;
};

export default page;
