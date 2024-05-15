"use client";
import "./Layout.css";

export default function Layout({ children }) {
	return (
		<div className="bgImage bg-cover bg-center h-[100vh] w-full relative z-1">
			<div className="w-1/2 h-full fixed top-0 right-0  z-[2] flex justify-center items-center [@media(max-width:1190px)]:w-full [@media(max-width:1190px)]:duration-1000">
				<div className="w-[600px] h-[700px] relative">{children}</div>
			</div>
		</div>
	);
}
