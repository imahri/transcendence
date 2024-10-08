import { postRequest, errorInForm } from "../AuthTools/LoginRegisterTools.jsx";
import { setcookie, settoken } from "../AuthTools/tokenManagment.jsx";
import { APIs } from "@/Tools/fetch_jwt_client.js";

function ErrorLogin(setError, response) {
	response.detail == "user not found"
		? errorInForm({ type: "username", msg: response.detail }, setError)
		: "";
	response.detail == "Wrong password"
		? errorInForm({ type: "password", msg: response.detail }, setError)
		: "";
	response.detail == "you cant sign-in"
		? errorInForm({ type: "username", msg: response.detail }, setError)
		: "";
}

export const handleSubmit = async (
	e,
	Form,
	setError,
	setPopUp2Fa,
	navigate,
	setisLoading,
) => {
	e.preventDefault();
	setisLoading(true);
	const FormField = Form.current;
	const username = FormField["username"].value;
	const password = FormField["password"].value;
	const checkBox = FormField["rememberMe"].checked;

	const requestBody = {
		identifier: username,
		password: password,
	};

	try {
		const response = await postRequest(APIs.auth.login, requestBody);
		const responseBody = await response.json();
		if (response.ok) {
			setisLoading(false);
			if (checkBox) setcookie("rememberMe", username);
			if (responseBody.success != undefined) {
				setPopUp2Fa(username);
				return;
			}
			settoken(responseBody);
			navigate.replace("/home");
		} else {
			setisLoading(false);
			ErrorLogin(setError, responseBody);
			setTimeout(() => {
				navigate.replace("/login");
			}, 5000);
			console.error("Login failed", response);
		}
	} catch (error) {
		setisLoading(false);
		console.error("Network error:", error);
	}
};

export const handel42 = async (e) => {
	e.preventDefault();

	const externalUrl = "https://api.intra.42.fr/oauth/authorize";
	const params = {
		client_id: process.env.NEXT_PUBLIC_42_CLIENT_KEY,
		redirect_uri: process.env.NEXT_PUBLIC_42_REDIRECT_URL,
		response_type: "code",
	};

	const queryString = Object.keys(params)
		.map(
			(key) =>
				`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
		)
		.join("&");

	const redirectUrl = `${externalUrl}?${queryString}`;
	window.location.href = redirectUrl;
};

export async function get42Token(
	navigate,
	code,
	setisLoading,
	setError,
	setPopUp2Fa,
) {
	setisLoading(true);
	let body = { code: code };
	try {
		const response = await fetch(APIs.auth.login_42, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (response.ok) {
			setisLoading(false);
			const data = await response.json();
			if (data?.success == "2FA Required") {
				return setPopUp2Fa(data.username);
			}
			settoken(data);
			navigate.replace("/home");
		} else {
			setisLoading(false);
			errorInForm(
				{ type: "intra", msg: "Login with intra failed" },
				setError,
			);
		}
	} catch (error) {
		setisLoading(false);
	}
}
