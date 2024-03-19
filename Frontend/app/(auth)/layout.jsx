"use client";

import { useEffect } from "react";
import { getToken } from "./AuthTools/tokenManagment";
import "./Layout.css";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
	const navigate = useRouter();
	useEffect(() => {
		getToken() ? navigate.replace("/home") : "";
	}, []);

	return (
		<div className="bgImage bg-cover bg-center h-[100vh] w-full relative z-1 max-[1190px]:bg-[#3E0A61] max-[1190px]:bg-none">
			<div className="w-1/2 h-full fixed top-0 right-0  z-[2] flex justify-center items-center max-[1190px]:w-full max-[1190px]:duration-1000">
				<div className="w-[600px] h-[700px] relative">{children}</div>
			</div>
		</div>
	);
}
