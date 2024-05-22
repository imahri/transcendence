import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { STARTOUR_URL, TOURNAMENT_URL } from "@/app/URLS";
import { myseterror } from "./CreateTournament";

export async function joinTournament(id, user, nickname, setError, setDemo) {
	//PUT add user to a tournament
	if (!nickname) nickname = user.username;
	const body = JSON.stringify({ tournament_id: id, alias_name: nickname });

	const [isOk, status, data] = await fetch_jwt(
		TOURNAMENT_URL,
		{},
		{
			method: "PUT",
			body: body,
			headers: { "Content-Type": "application/json" },
		},
	);

	if (!isOk) {
		console.log(data);
		myseterror(setError, true);
		return;
	}
	setDemo(data);
}

export async function startTournament(id, setError) {
	//start tournament

	const [isOk, status, data] = await fetch_jwt(STARTOUR_URL, { id: id });

	if (!isOk) {
		console.log(data);
		myseterror(setError, data);
		return;
	}
	console.log(data);
}

export async function quitTournament(id, setError) {
	//quit tournament
	console.log("quit tournament");
}
