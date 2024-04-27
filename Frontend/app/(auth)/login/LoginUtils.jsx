import { LOGIN_URL } from "../../URLS.jsx";
import { postRequest, errorInForm } from "../AuthTools/LoginRegisterTools";
import { settoken } from "../AuthTools/tokenManagment";

export const handleSubmit = async (
	e,
	Form,
	setErrorUsername,
	setErrorPassword,
	setError,
	setPopUp2Fa,
	navigate,
) => {
	e.preventDefault();

	const FormField = Form.current;
	const username = FormField["username"].value.trim();
	const password = FormField["password"].value.trim();

	if (!username) {
		console.log("user name is empty");
		errorInForm(setErrorUsername, setError);
		return;
	}
	if (!password) {
		console.log("password is empty");
		errorInForm(setErrorPassword, setError);
		return;
	}

	const requestBody = {
		identifier: username,
		password: password,
	};

	try {
		const response = await postRequest(LOGIN_URL, requestBody);
		if (response.ok) {
			const responseBody = await response.json();
			if (responseBody.success != undefined) {
				console.log("OTP required");
				setPopUp2Fa(username);
				return;
			}
			console.log("login success");
			settoken(responseBody);
			// setUser(responseBody.user);
			// localStorage.setItem("user", JSON.stringify(responseBody.user));
			navigate.replace("/home");
		} else {
			setError(true);
			setTimeout(() => {
				setError(false);
			}, 5000);
			console.error("Login failed", response);
		}
	} catch (error) {
		console.error("Network error:", error);
	}
};
