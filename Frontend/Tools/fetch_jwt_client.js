import {
	getRefreshToken,
	getToken,
	removeTokens,
	setcookie,
} from "@/app/(auth)/AuthTools/tokenManagment";

export const Host = process.env.NEXT_PUBLIC_HOST;
export const BASE_URL = `https://${Host}:443`; // #! check this
export const WS = `wss://${Host}:443`; // #! check this

const AUTH_APP = `${BASE_URL}/auth`;
const GAME_APP = `${BASE_URL}/Game`;
const USER_APP = `${BASE_URL}/user`;
const TOURNAMENT_APP = `${BASE_URL}/tournament`;

export const APIs = {
	chat: {
		ws: `${WS}/ws/chat`,
		messages: `${BASE_URL}/chat/messages`,
		last_message: `${BASE_URL}/chat/conversations/last_message/`,
		conversations: `${BASE_URL}/chat/conversations`,
	},
	auth: {
		login: `${AUTH_APP}/login`,
		register: `${AUTH_APP}/register`,
		logout: `${AUTH_APP}/logout`,
		refresh: `${AUTH_APP}/refresh_token`,
		verify_token: `${AUTH_APP}/verify_token`,
		login_42: `${AUTH_APP}/42auth`,
		towfactor: `${AUTH_APP}/2FA`,
		towfactor_qr: `${AUTH_APP}/2FA/qrcode`,
	},
	image: (path) => `${USER_APP}/image?path=${path}`,
	user: {
		notif_ws: `${WS}/ws/notif`,
		user: `${USER_APP}/`,
		search: `${USER_APP}/search`,
		get_user: `${USER_APP}/user`,
		post_info: `${USER_APP}/info`,
		block: `${USER_APP}/block`,
		friendship: `${USER_APP}/friendship`,
		my_friends: `${USER_APP}/friends`,
		five_friends: `${USER_APP}/somefriends`,
		other_friends: `${USER_APP}/userfriends`,
		notification: `${USER_APP}/notification`,
		msg_notification: `${USER_APP}/msgnotif`,
	},
	game: {
		rank: `${BASE_URL}/Game/rank`,
		paddles: `${GAME_APP}/padle`,
		boards: `${GAME_APP}/board`,
		badges: `${GAME_APP}/badge`,
		items: `${GAME_APP}/items`,
		curren_item: `${GAME_APP}/equipeditem`,
		missions: `${GAME_APP}/missions`,
		acheivments: `${GAME_APP}/acheivement`,
		check_acheivments: `${GAME_APP}/achievement/check`,
		matches: `${GAME_APP}/match`,
		create_room: `${GAME_APP}/room`,
	},
	tournament: {
		tournament: `${TOURNAMENT_APP}/`,
		search: `${TOURNAMENT_APP}/search`,
		start: `${TOURNAMENT_APP}/StartTournament`,
		get_tournament: `${TOURNAMENT_APP}/getbyname/`,
	},
};

async function refreshToken() {
	const refresh = getRefreshToken();
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
		const token = getToken();
		const headers = new Headers(init?.headers);
		if (token) headers.set("Authorization", `Bearer ${token}`);
		const response = await fetch(url, { ...init, headers });
		if (response.status == 401) {
			const [isOk, new_token] = await refreshToken();
			if (isOk) {
				setcookie("access_token", new_token);
				return fetch_jwt(endpoint, query_params, init);
			} else {
				removeTokens();
				return [false, 401, "Refresh token is Expired"];
			}
		}
		const data = await response.json();
		return [response.ok, response.status, data];
	} catch (error) {
		return [false, 500, error];
	}
};
