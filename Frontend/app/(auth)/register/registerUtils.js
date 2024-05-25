import { REGISTER_URL } from "../../URLS";

import { postRequest, errorInForm } from "../AuthTools/LoginRegisterTools";

function onlySpace(str) {
	return str.trim().length == 0;
}

function check_fields(form, setError) {
	if (!form.username) {
		errorInForm(
			{ type: "username", msg: "username contain only space" },
			setError,
		);
		return true;
	}
	if (!form.firstname) {
		errorInForm(
			{ type: "first_name", msg: "firstname contain only space" },
			setError,
		);
		return true;
	}
	if (!form.lastname) {
		errorInForm(
			{ type: "last_name", msg: "lastname contain only space" },
			setError,
		);
		return true;
	}
	if (!form.password) {
		errorInForm(
			{ type: "password", msg: "password contain only space" },
			setError,
		);
		return true;
	}
	if (form.password.length < 9) {
		errorInForm(
			{
				type: "password",
				msg: "password should contain at least 9 charachter",
			},
			setError,
		);
		return true;
	}
	return false;
}

function DetectError(response, setError) {
	response?.username
		? errorInForm({ type: "username", msg: response.username[0] }, setError)
		: "";
}

export const registerSubmit = async (
	e,
	Form,
	setError,
	navigate,
	setLoading,
) => {
	e.preventDefault();

	setLoading(true);
	const FormField = Form.current;

	const form = {
		firstname: FormField["firstname"].value,
		lastname: FormField["lastname"].value,
		password: FormField["password"].value,
		username: FormField["username"].value,
	};

	form.lastname = onlySpace(form.lastname) ? "" : form.lastname;
	form.firstname = onlySpace(form.firstname) ? "" : form.firstname;
	form.password = onlySpace(form.password) ? "" : form.password;

	if (check_fields(form, setError)) {
		setLoading(false);
		return;
	}

	const requestBody = {
		username: form.username,
		first_name: form.firstname,
		last_name: form.lastname,
		password: form.password,
		email: form.email,
	};

	try {
		const response = await postRequest(REGISTER_URL, requestBody);

		if (response.ok) {
			console.log("Login successful");
			navigate.replace("/login");
		} else {
			const responseBody = await response.json();

			DetectError(responseBody, setError);
			console.error("Login failed", responseBody);
			setLoading(false);
		}
	} catch (error) {
		console.error("Network error:", error);
	}
};
