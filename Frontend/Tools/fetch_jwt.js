import { BASE_URL } from "@/app/URLS";
import { cookies } from "next/headers";

export const APIs = {
	chat: {
		conversations: `${BASE_URL}/chat/conversations`,
		messages: `${BASE_URL}/chat/messages`,
	},
	// ....
};

/**
 * @param endpoint use {@link APIs}
 * @param query_params passed as object
 */
export const fetch_jwt = async (endpoint, query_params, init) => {
	const url =
		query_params === undefined
			? endpoint
			: `${endpoint}?${new URLSearchParams(query_params)}`;
	const token = cookies().get("access_token")?.value;
	const headers = new Headers(init?.headers);
	if (token) headers.set("Authorization", `Bearer ${token}`);

	const response = await fetch(url, { ...init, headers });
	if (!response.ok)
		throw {
			error: response.statusText,
			status: response.status,
		};
	const data = await response.json();
	return data;
};
