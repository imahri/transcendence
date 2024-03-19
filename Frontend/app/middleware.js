import { NextResponse } from "next/server";

export async function middleware(request) {
	const isAuthenticated = false; // TODO: check if Authenticated

	if (!isAuthenticated) return NextResponse.redirect("/login");
	return NextResponse.next();
}

export const config = {
	matcher: ["/test1/:path*", "/test2/:path*"],
};
