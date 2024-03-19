import { REGISTER_URL } from "../../URLS";

import { postRequest, errorInForm } from "../AuthTools/LoginRegisterTools";

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export const registerSubmit = async (e, Form, navigate) => {
	const FormField = Form.current;

	const firstname = FormField["firstname"].value.trim();
	const lastname = FormField["lastname"].value.trim();
	const email = FormField["email"].value.trim();
	const password = FormField["password"].value.trim();
	// const username = FormField['username'].value

	e.preventDefault();
	if (!firstname) {
		console.log("user name is empty");
		errorInForm(setErrorFirstname, setError);
		return;
	}
	if (!lastname) {
		errorInForm(setErrorLastname, setError);
		console.log("last name is empty");
		return;
	}
	if (!isValidEmail(email)) {
		errorInForm(setErrorEmail, setError);
		console.log("email is not valid");
		return;
	}
	if (!password || password.length < 8) {
		errorInForm(setErrorPassword, setError);
		console.log("password is not valid");
		return;
	}

	const requestBody = {
		username: firstname, //username is firstname for now but the design will change to enter username
		first_name: firstname,
		last_name: lastname,
		password: password,
		email: email,
	};

	try {
		const response = await postRequest(REGISTER_URL, requestBody);

		if (response.ok) {
			console.log("Login successful");
			navigate.replace("/login");
		} else {
			console.error("Login failed", response);
		}
	} catch (error) {
		console.error("Network error:", error);
	}
};
