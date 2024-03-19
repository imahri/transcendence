"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		router.push("/home"); // Redirect to /home on component mount
	}, [router]); // Dependency array to avoid infinite loops

	return (
		<div>
			{/* You can optionally display some content while redirecting (optional) */}
			Redirecting to Home page...
		</div>
	);
}
