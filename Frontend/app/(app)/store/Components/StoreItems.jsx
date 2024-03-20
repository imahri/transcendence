import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";

export async function getStoreItem(url, navigate) {
	const accessToken = getToken();

	try {
		const response = await fetch(url, {
			headers: { Authorization: `Bearer  ${accessToken}` },
		});
		if (response.ok) {
			const data = await response.json();
			return data;
		} else if (response.status == 401) {
			console.log("error autorization", response);
			navigate.replace("/login");
		} else {
			console.log("error response", response);
		}
	} catch (error) {
		console.error("catch error", error);
	}
	return false;
}

export const walletSvg = (
	<svg
		width="20"
		height="20"
		viewBox="0 0 6 15"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.97368 0V4.81394L0 5.52632V10.7257L2.36842 11.4474V9.86842L0.789474 9.47369V6.71053L1.97368 6.31579V7.10526H2.76316V0H1.97368Z"
			fill="white"
		/>
		<path
			d="M3.94721 15L3.94721 10.1861L5.9209 9.47368L5.9209 4.27426L3.55248 3.55263L3.55248 5.13158L5.13142 5.52631V8.28947L3.94721 8.68421V7.89474H3.15774L3.15774 15H3.94721Z"
			fill="white"
		/>
	</svg>
);
