import { setCookie, getCookie, deleteCookie } from "cookies-next";
// import { REFRESH_TOKEN_URL } from "../../URLS.jsx";

export function settoken(tokens) {
	setCookie("access_token", tokens.access, { sameSite: "strict" });
	setCookie("refresh_token", tokens.refresh, { sameSite: "strict" });
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

// export async function refreshToken() {
// 	console.log("refresh hhhhh");
// 	const refresh_token = cookies().get("refresh_token");
// 	const body = { refresh: refresh_token };

// 	try {
// 		const respons = await fetch(REFRESH_TOKEN_URL, {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify(body),
// 		});
// 		if (respons.ok) {
// 			const data = await respons.json();
// 			const access_token = data.access;
// 			cookies().set("access_token", await access_token, {
// 				sameSite: "strict",
// 			});
// 			return true;
// 		} else {
// 			console.error("response error : ", respons);
// 			return false;
// 		}
// 	} catch (error) {
// 		console.error("network error : ", error);
// 		return false;
// 	}
// }

// export async function refreshAndRefetch(refetshFunction, navigate) {
// 	if (await refreshToken()) await refetshFunction();
// 	else navigate(navig);
// }
