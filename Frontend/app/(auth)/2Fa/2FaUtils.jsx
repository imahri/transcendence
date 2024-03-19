import { settoken } from "../AuthTools/tokenManagment";
import { TOWFACTOR_URL, TOWFACTOR_QR_URL } from "../../URLS";

async function sendNumber(username, code) {
	let params = new URLSearchParams();
	params.append("user", username);
	params.append("OTP", code);

	const url = TOWFACTOR_URL + "?" + params.toString();

	const response = await fetch(url);
	return response;
}

export async function submitNumber(username, code, setErrorSubmit, navigate) {
	function error() {
		setErrorSubmit(true);
		setTimeout(() => setErrorSubmit(false), 5000);
	}

	if (isNaN(code) || code.length != 6) {
		error();
		return;
	}

	try {
		const response = await sendNumber(username, code);
		if (response.ok) {
			const tokens = await response.json();
			settoken(tokens);
			console.log("login success");
			navigate.replace("/home");
		} else {
			error();
			console.log("error response :", response);
		}
	} catch (error) {
		console.log("Network error : ", error);
	}
}

export function setNumber(e, setError, setCode, setReady) {
	let number = e.target.value;
	setCode(number);
	if (isNaN(number)) {
		setError(true);
		setTimeout(() => setError(false), 1000);
	}
	if (number.length == 6) setReady(true);
	else setReady(false);
}
