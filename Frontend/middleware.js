import { NextResponse } from "next/server";
import { fetch_jwt } from "./Tools/fetch_jwt_server";
import { APIs } from "./Tools/fetch_jwt_client";

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

	const [isOk, status, data] = await fetch_jwt(APIs.auth.verify_token);
	if (!isOk) {
		if (status == 500) return NextResponse.error();
		console.log("Token verification failed");
		if (AuthPath.some((path) => pathname.startsWith(path))) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/login", request.url));
	}
	if (AuthPath.some((path) => pathname.startsWith(path))) {
		return NextResponse.redirect(new URL("/", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: "/((?!_next/static|favicon.ico).*)",
};
