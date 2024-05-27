import { AUTH_42, LOGIN_URL } from "../../URLS.js";
import { postRequest, errorInForm } from "../AuthTools/LoginRegisterTools.jsx";
import { settoken } from "../AuthTools/tokenManagment.jsx";

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

	const requestBody = {
		identifier: username,
		password: password,
	};

	try {
		const response = await postRequest(LOGIN_URL, requestBody);
		const responseBody = await response.json();
		if (response.ok) {
			if (responseBody.success != undefined) {
				console.log("OTP required");
				setPopUp2Fa(username);
				return;
			}
			console.log("login success");
			setisLoading(false);
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
		client_id:
			"u-s4t2ud-ef24706709b2ebced52c2f14a643d130751366c3ebabc309cb18be033c4f8259",
		redirect_uri: "http://localhost:3000/login",
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

export async function get42Token(navigate, code, setisLoading, setError) {
	setisLoading(true);
	let body = { code: code };
	try {
		const response = await fetch(AUTH_42, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (response.ok) {
			const tokens = await response.json();
			settoken(tokens);
			console.log("Login successful");
			navigate.replace("/home");
		} else {
			setisLoading(false);
			errorInForm(
				{ type: "intra", msg: "Login with intra failed" },
				setError,
			);
			console.error("Login failed");
		}
	} catch (error) {
		setisLoading(false);
		console.error("Network error:", error);
	}
}
