import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { USER_URL } from "@/app/URLS";

function onlySpace(str) {
	return str.trim().length == 0;
}

function errorInForm(setError, error) {
	setError(error);
	setTimeout(() => {
		setError(false);
	}, 5000);
}

async function sent(NewInfo, setError, setUser, closePopup) {
	const formData = new FormData();

	NewInfo.profile_img
		? formData.append("profile_img", NewInfo.profile_img)
		: "";
	NewInfo.last_name ? formData.append("last_name", NewInfo.last_name) : "";
	NewInfo.first_name ? formData.append("first_name", NewInfo.first_name) : "";

	const [isOk, status, data] = await fetch_jwt(
		USER_URL,
		{},
		{
			method: "POST",
			body: formData,
		},
	);

	if (!isOk) {
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
	closePopup(false);
	setUser(data);
}

export function ChangeInfo(
	e,
	Form,
	username,
	setError,
	setUser,
	closePopup,
	setLoading,
) {
	e.preventDefault();

	setLoading(true);
	const FormField = Form.current;

	const NewInfo = {
		profile_img: FormField["profile"].files[0],
		first_name: FormField["firstname"].value,
		last_name: FormField["lastname"].value,
	};

	NewInfo.last_name = onlySpace(NewInfo.last_name) ? "" : NewInfo.last_name;
	NewInfo.first_name = onlySpace(NewInfo.first_name)
		? ""
		: NewInfo.first_name;

	if (!NewInfo.first_name && !NewInfo.last_name && !NewInfo.profile_img) {
		errorInForm(setError, {
			type: "field",
			msg: "You should change at least one field befor submit",
		});
		setLoading(false);
		return;
	}
	if (NewInfo.profile_img.name.length > 100) {
		const newName =
			username +
			"_profile_img." +
			NewInfo.profile_img.name.split(".").pop();
		const newFile = new File([NewInfo.profile_img], newName, {
			type: NewInfo.profile_img.type,
			lastModified: NewInfo.profile_img.lastModified,
		});

		NewInfo.profile_img = newFile;
	}
	sent(NewInfo, setError, setUser, closePopup);
	setLoading(false);
}
