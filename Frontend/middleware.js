import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export default function middleware(request) {
	const isAuthenticated = false; // TODO: check if Authenticated

	if (!isAuthenticated)
		return NextResponse.redirect(new URL("/login", request.url));
	return NextResponse.next();
}

export const config = {
	matcher: "/((?!login|register|favicon.ico).*)",
};
