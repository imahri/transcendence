import { NextResponse } from "next/server";
import { fetch_jwt } from "./Tools/fetch_jwt_server";
import { VERIFY_TOKEN_URL } from "./app/URLS";

export default async function middleware(request) {
	const isAuthenticated = request.cookies.get("access_token")?.value;

	if (!isAuthenticated) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		const [isOk, status, data] = await fetch_jwt(VERIFY_TOKEN_URL);

		if (!isOk) {
			console.log("Token verification failed");
			return NextResponse.redirect(new URL("/login", request.url));
		}
		console.log("Token verified");
	} catch (error) {
		console.error("Network error", error);
		return NextResponse.error();
	}
	return NextResponse.next();
}

export const config = {
	matcher: "/((?!login|welcome|register|_next/static|favicon.ico).*)",
};
