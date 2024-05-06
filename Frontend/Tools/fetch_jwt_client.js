import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { BASE_URL } from "@/app/URLS";

export const APIs = {
	chat: {
		conversations: `${BASE_URL}/chat/conversations`,
		last_message: `${BASE_URL}/chat/conversations/last_message/`,
		messages: `${BASE_URL}/chat/messages`,
	},
	user: {
		friends: `${BASE_URL}/user/friends`,
	},
	// ....
};

/**
 * Fetches data from the server using JWT authentication.
 * @param {string} endpoint - The endpoint URL.
 * @param {Object} query_params - The query parameters to be appended to the URL.
 * @param {Object} init - The optional initialization options for the fetch request.
 * @returns {Promise<[boolean, number, any]>} - A promise that resolves to an array containing the success status, response status code, and the data returned from the server.
 */
export const fetch_jwt = async (endpoint, query_params, init) => {
	try {
		const url =
			query_params === undefined
				? endpoint
				: `${endpoint}?${new URLSearchParams(query_params)}`;
		const token = getToken();
		const headers = new Headers(init?.headers);
		if (token) headers.set("Authorization", `Bearer ${token}`);
		const response = await fetch(url, { ...init, headers });
		const data = await response.json();
		return [response.ok, response.status, data];
	} catch (error) {
		return [false, 500, error];
	}
};
