import { TOWFACTOR_URL, TOWFACTOR_QR_URL, LOGOUT_URL } from "../../../URLS.js";

import {
	getToken,
	getRefreshToken,
	removeTokens,
} from "../../../(auth)/AuthTools/tokenManagment.jsx";
import { fetch_jwt } from "@/Tools/fetch_jwt_client.js";

export async function logout(navigate) {
	const requestBody = { refresh: getRefreshToken() };

	const [isOk, status, data] = await fetch_jwt(
		LOGOUT_URL,
		{},
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		},
	);
	if (!isOk) {
		console.log(data);
		return;
	}
	removeTokens();
	navigate.replace("/welcome");
}

async function desactivate2FA() {
	const token = getToken();
	const response = await fetch(TOWFACTOR_URL, {
		method: "DELETE",
		headers: { Authorization: "Bearer " + token },
	});

	return response;
}

async function fetchCodeQr() {
	const token = getToken();
	const response = await fetch(TOWFACTOR_URL, {
		method: "POST",
		headers: { Authorization: "Bearer " + token },
	});
	return response;
}

async function refetchCodeQr() {
	const token = getToken();
	const response = await fetch(TOWFACTOR_QR_URL, {
		headers: { Authorization: "Bearer " + token },
	});
	return response;
}

export async function TowFaHandler(TowFa, setTowFa, setQrImage) {
	try {
		if (TowFa) {
			const resonse = await desactivate2FA();
			if (resonse.ok) {
				console.log("2Fa desactivated");
				setTowFa(false);
			} else {
				console.error("error in desactivat", resonse);
			}
			return;
		}
		const response = await fetchCodeQr();
		if (response.ok) {
			const responseBlob = await response.blob();
			const src = URL.createObjectURL(responseBlob);
			setQrImage(src);
			setTowFa(true);
		} else if (response.status == 401) {
			//navigate to login
			console.log("error", response);
		} else {
			console.log("error", response);
		}
	} catch (error) {
		console.error("Fetch error", error);
	}
}

export async function getCodeQr(setShowQr, qrCode) {
	try {
		if (qrCode) {
			setShowQr(qrCode);
			return;
		}
		const response = await refetchCodeQr();
		if (response.ok) {
			const responseBlob = await response.blob();
			const src = URL.createObjectURL(responseBlob);
			setShowQr(src);
		} else if (response.status == 401) {
			//navigate to login
			console.log("error", response);
		} else {
			console.log("error", response);
		}
	} catch (error) {
		console.error("Fetch error", error);
	}
}
