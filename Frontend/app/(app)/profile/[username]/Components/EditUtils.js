import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { isValidEmail } from "@/app/(auth)/register/registerUtils";
import { POST_INFO_URL, USER_URL } from "@/app/URLS";

function errorInForm(setError, error) {
	//I change the state to true to re-render the componnents and disply the eroor section
	setError(error);
	setTimeout(() => {
		//here i try to display error msg but only for 5s
		setError(false);
	}, 5000);
}

function sent(NewInfo, setError, setUser) {
	const formData = new FormData();

	NewInfo.profile_img
		? formData.append("profile_img", NewInfo.profile_img)
		: "";
	NewInfo.username ? formData.append("username", NewInfo.username) : "";
	NewInfo.last_name ? formData.append("last_name", NewInfo.last_name) : "";
	NewInfo.first_name ? formData.append("first_name", NewInfo.first_name) : "";
	NewInfo.email ? formData.append("email", NewInfo.email) : "";
	formData.append("password", NewInfo.password);

	fetch_jwt(
		USER_URL,
		{},
		{
			method: "POST",
			body: formData,
		},
	).then(([isOk, status, data]) => {
		if (!isOk) {
			console.log(data);
			const error = "an error has been accured";
			data.username
				? errorInForm(setError, {
						type: "username",
						msg: data.username[0],
					})
				: "";
			data.email
				? errorInForm(setError, { type: "email", msg: data.email[0] })
				: "";
			data.first_name
				? errorInForm(setError, {
						type: "first_name",
						msg: data.first_name[0],
					})
				: "";
			data.last_name
				? errorInForm(setError, {
						type: "last_name",
						msg: data.last_name[0],
					})
				: "";
			data.profile_img
				? errorInForm(setError, {
						type: "profile_img",
						msg: data.profile_img,
					})
				: "";

			return;
		}
		setUser(data);
	});
}

export function ChangeInfo(e, Form, setError, setUser) {
	e.preventDefault();

	const FormField = Form.current;

	const NewInfo = {
		username: FormField["username"].value.trim(),
		first_name: FormField["firstname"].value.trim(),
		last_name: FormField["lastname"].value.trim(),
		profile_img: FormField["profile"].files[0],
		email: FormField["email"].value.trim(),
		password: FormField["password"].value.trim(),
	};

	if (NewInfo.email && !isValidEmail(NewInfo.email)) {
		errorInForm(setError, { type: "email", msg: "email is invalid" });
	}

	sent(NewInfo, setError, setUser);

	// setError(NewInfo.profile_img)
}
