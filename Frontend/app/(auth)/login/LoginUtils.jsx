import { LOGIN_URL } from "../../URLS.jsx";
import { postRequest, errorInForm } from "../AuthTools/LoginRegisterTools";
import { settoken } from "../AuthTools/tokenManagment";

function ErrorLogin(setError, response) {
	response.detail == "user not found"
		? errorInForm({ type: "username", msg: response.detail }, setError)
		: "";
	response.detail == "Wrong password"
		? errorInForm({ type: "password", msg: response.detail }, setError)
		: "";
}

export const handleSubmit = async (
	e,
	Form,
	setError,
	setPopUp2Fa,
	navigate,
) => {
	e.preventDefault();

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
			settoken(responseBody);

			navigate.replace("/home");
		} else {
			ErrorLogin(setError, responseBody);
			console.error("Login failed", response);
		}
	} catch (error) {
		console.error("Network error:", error);
	}
};
