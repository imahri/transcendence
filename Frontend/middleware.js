import { NextResponse } from "next/server";
import { fetch_jwt } from "./Tools/fetch_jwt_server";
import { VERIFY_TOKEN_URL } from "./app/URLS";

export default async function middleware(request) {
	const isAuthenticated = request.cookies.get("access_token")?.value;
	const AuthPath = ["/login", "/welcome", "/register"];
	const pathname = request.nextUrl.pathname;

	if (!isAuthenticated) {
		if (AuthPath.some((path) => pathname.startsWith(path))) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		const [isOk, status, data] = await fetch_jwt(VERIFY_TOKEN_URL);

		if (!isOk) {
			console.log("Token verification failed");
			if (AuthPath.some((path) => pathname.startsWith(path))) {
				return NextResponse.next();
			}
			return NextResponse.redirect(new URL("/login", request.url));
		}
		console.log("Token verified");
		if (AuthPath.some((path) => pathname.startsWith(path))) {
			return NextResponse.redirect(new URL("/", request.url));
		}
	} catch (error) {
		console.error("Network error", error);
		return NextResponse.error();
	}
	return NextResponse.next();
}

export const config = {
	matcher: "/((?!_next/static|favicon.ico).*)",
};
