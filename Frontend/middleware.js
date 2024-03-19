import { NextResponse } from "next/server";

export default function middleware(request) {
	const isAuthenticated = request.cookies.get("access_token")?.value;

	if (!isAuthenticated)
		return NextResponse.redirect(new URL("/login", request.url));
	return NextResponse.next();
}

export const config = {
	matcher: "/((?!login|welcome|register|_next/static|favicon.ico).*)",
};
