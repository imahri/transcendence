import { getToken } from "../(auth)/AuthTools/tokenManagment";
import { USER_URL } from "../URLS";
import { logout } from "./settings/Components/SettingsUtils";

async function fetchUser() {
	const accessToken = getToken();

	const response = await fetch(USER_URL, {
		headers: { Authorization: `Bearer  ${accessToken}` },
	});
	return response;
}

async function layoutUtils(navigate, setUser) {

	const storedUser = localStorage.getItem("user");
	if (storedUser) {
		const user = JSON.parse(storedUser);
		setUser(user);
		return true;
	}

	try {
		const response = await fetchUser();
		if (response.ok) {
			const data = await response.json();
			console.log(data);
			localStorage.setItem("user", data);
			setUser(data);
			return true;
		} else {
			console.log(response);
		}
	} catch (error) {
		console.error("fetch Error :", error);
	}
	logout(navigate);
}

export default layoutUtils;
