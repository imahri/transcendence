import { cookies } from "next/headers";
import { APIs } from "./fetch_jwt_client";

export async function refreshToken() {
	const refresh = cookies().get("refresh_token")?.value;
	const response = await fetch(APIs.auth.refresh, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refresh: refresh }),
	});
	if (response.ok) {
		const data = await response.json();
		return [true, data.access];
	}
	return [false, ""];
}

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
		const token = cookies().get("access_token")?.value;
		const headers = new Headers(init?.headers);
		if (token) headers.set("Authorization", `Bearer ${token}`);
		const response = await fetch(url, {
			...init,
			headers,
			cache: "no-cache",
		});
		if (response.status == 401)
			return [false, 401, "access token is Expired"];
		const data = await response.json();
		return [response.ok, response.status, data];
	} catch (error) {
		return [false, 500, error];
	}
};
