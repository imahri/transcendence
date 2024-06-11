import { APIs } from "@/Tools/fetch_jwt_client.js";

import {
	getToken,
	getRefreshToken,
	removeTokens,
} from "../../../(auth)/AuthTools/tokenManagment.jsx";
import { fetch_jwt } from "@/Tools/fetch_jwt_client.js";

export async function logout(navigate) {
	const requestBody = { refresh: getRefreshToken() };

	const [isOk, status, data] = await fetch_jwt(
		APIs.auth.logout,
		{},
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		},
	);
	if (!isOk) {
		return;
	}
	removeTokens();
	navigate.replace("/welcome");
}

async function fetchCodeQr() {
	const token = getToken();
	const response = await fetch(APIs.auth.towfactor, {
		method: "POST",
		headers: { Authorization: "Bearer " + token },
	});
	return response;
}

async function refetchCodeQr() {
	const token = getToken();
	const response = await fetch(APIs.auth.towfactor_qr, {
		headers: { Authorization: "Bearer " + token },
	});
	return response;
}

export async function TowFaHandler(TowFa, setTowFa, setQrImage) {
	try {
		if (TowFa) {
			const [isOk, status, resonse] = await fetch_jwt(
				APIs.auth.towfactor,
				null,
				{
					method: "DELETE",
				},
			);
			if (isOk) {
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
		}
	} catch (error) {
		console.error("Fetch error", error);
	}
}
