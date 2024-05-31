import { fetch_jwt } from "@/Tools/fetch_jwt_client";
import { CREATEROOM_URL } from "@/app/URLS";

export function setType(notifType, notifContent, username) {
	const sentMsg = "Sent you a message";
	const sentInvit = "Sent you a Invitation";
	const sentAccept = "Accept your Invitation";
	const sentGameInvit = "Sent you Game Invitation";
	const rejectGameInvit = "Reject Your Game Invitation";
	const StartPlay = "You Can Play now";
	const TournamentMatch = "You have match with ";

	if (notifType == "C") return sentMsg;
	if (notifContent.status == "add") return sentInvit;
	else if (notifType == "G") {
		if (notifContent.type == "invit") return sentGameInvit;
		if (notifContent.type == "start") return StartPlay;
		else return rejectGameInvit;
	} else if (notifType == "T") {
		if (notifContent.type == "match")
			return TournamentMatch + notifContent[username];
		else return notifContent.message;
	} else return sentAccept;
}

export function readNotif(socket, notif, setNbNotif) {
	if (notif.is_read) return;
	socket.send(
		JSON.stringify({
			action: "readNotif",
			id: notif.id,
		}),
	);
	setNbNotif((prev) => {
		if (prev <= 0) return prev;
		else return prev - 1;
	});
	notif.is_read = true;
}

export function getNotifLink(notif) {
	if (notif.type == "F") return `/profile/${notif.user.username}`;
	if (notif.type == "C") return `/chat/${notif.user.username}`;
	if (notif.type == "G" && notif.content.type == "start")
		return `/game/matching?room=${notif.content.room_name}`;
	if (notif.type == "T" && notif.content.type == "match")
		return `/game/matching?room=${notif.content.room_name}?tournament=${notif.content.tournament_name}`;
	if (notif.type == "T")
		return `/tournament/result/${notif.content.tournament_name}`;
	else return "#";
}

export function calculateTimeDifference(pastDateTime) {
	var pastDate = new Date(pastDateTime);
	var currentDate = new Date();

	var timeDiff = currentDate - pastDate;

	var seconds = Math.floor(timeDiff / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var weeks = Math.floor(days / 7);
	var months = Math.floor(days / 30);
	var years = Math.floor(days / 365);

	if (years > 0) return years + " year" + (years > 1 ? "s" : "") + " ago";
	else if (months > 0)
		return months + " month" + (months > 1 ? "s" : "") + " ago";
	else if (weeks > 0)
		return weeks + " week" + (weeks > 1 ? "s" : "") + " ago";
	else if (days > 0) return days + " day" + (days > 1 ? "s" : "") + " ago";
	else if (hours > 0)
		return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
	else if (minutes > 0)
		return minutes + " minute" + (minutes > 1 ? "s" : "") + " ago";
	else return seconds + " second" + (seconds > 1 ? "s" : "") + " ago";
}

export function decline(ws, notif) {
	const content = {
		to: notif.user.username,
		type: "G",
		content: "reject",
	};
	ws.send(
		JSON.stringify({
			action: "send_notif",
			content: content,
		}),
	);
}

export async function accept(notif) {
	const [isOk, status, data] = await fetch_jwt(
		CREATEROOM_URL,
		{ username: notif.user.username },
		{ method: "POST" },
	);
	if (!isOk) {
		console.log(data);
		return;
	}
	console.log(data);
}
