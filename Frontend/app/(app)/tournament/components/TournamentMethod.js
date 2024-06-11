import { fetch_jwt, APIs } from "@/Tools/fetch_jwt_client";
import { myseterror } from "./CreateTournament";

export async function joinTournament(
	id,
	user,
	nickname,
	setError,
	setDemo,
	setInfo,
	setButton,
) {
	if (!nickname) nickname = user.username;
	const body = JSON.stringify({ tournament_id: id, alias_name: nickname });

	const [isOk, status, data] = await fetch_jwt(
		APIs.tournament.tournament,
		{},
		{
			method: "PUT",
			body: body,
			headers: { "Content-Type": "application/json" },
		},
	);

	if (!isOk) {
		myseterror(setError, true);
		return;
	}
	setDemo(data);
	myseterror(setInfo, "User Joined the Tournament");
	setButton("Already In");
}

export async function startTournament(id, setError, setButton, setInfo) {
	const [isOk, status, data] = await fetch_jwt(
		APIs.tournament.start,
		{ id: id },
		{ method: "POST" },
	);

	if (!isOk) {
		myseterror(setError, data);
		return;
	}
	myseterror(setInfo, "Tournament is Stareted");
	setButton("Started");
}

export async function quitTournament(id, setError) {
}
