import { setCookie, getCookie, deleteCookie } from "cookies-next";

export function settoken(tokens) {
	setCookie("access_token", tokens.access, { sameSite: "strict" });
	setCookie("refresh_token", tokens.refresh, { sameSite: "strict" });
}

export function setcookie(key, value) {
	setCookie(key, value, { sameSite: "strict" });
}

export function getcookie(key) {
	return getCookie(key);
}

export function removeTokens() {
	deleteCookie("refresh_token");
	deleteCookie("access_token");
}

export function getToken() {
	return getCookie("access_token");
}
export function getRefreshToken() {
	return getCookie("refresh_token");
}