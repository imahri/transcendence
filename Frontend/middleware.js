import { NextResponse } from "next/server";
import { fetch_jwt, refreshToken } from "./Tools/fetch_jwt_server";
import { APIs } from "./Tools/fetch_jwt_client";

export default async function middleware(request) {
	const isAuthenticated = request.cookies.get("access_token")?.value;
	const AuthPath = ["/login", "/welcome", "/register"];
	const pathname = request.nextUrl.pathname;
	const response = NextResponse.next();

	if (!isAuthenticated) {
		if (AuthPath.some((path) => pathname.startsWith(path))) {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL("/login", request.url));
	}

	const [isOk, status] = await fetch_jwt(APIs.auth.verify_token);
	if (!isOk) {
		response.cookies.delete("access_token");
		if (status == 500) return NextResponse.error();
		console.log("Token verification failed");
		const [isOk, new_token] = await refreshToken();
		if (isOk) response.cookies.set("access_token", new_token);
		else {
			const response = NextResponse.redirect(
				new URL("/login", request.url),
			);
			response.cookies.delete("access_token");
			response.cookies.delete("refresh_token");
			return response;
		}
		return response;
	}
	if (AuthPath.some((path) => pathname.startsWith(path))) {
		return NextResponse.redirect(new URL("/", request.url));
	}
	return response;
}

export const config = {
	matcher: "/((?!_next/static|favicon.ico).*)",
};
