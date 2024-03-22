import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { GET_USER_URL } from "@/app/URLS";

async function fetchUser(username) {
	const accessToken = getToken();
	const url = `${GET_USER_URL}?username=${username}`;

	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	return response;
}

export async function getUser(username) {
	try {
		const response = await fetchUser(username);
		if (response.ok) {
			const userData = await response.json();
			return userData;
		} else {
			console.log("error : ", response);
		}
	} catch (error) {
		console.log("network error", error);
	}
}
