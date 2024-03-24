"use client";
import { Converstation } from "../../Components/Conversations/ConversationSection";
import MessagesSection from "../../Components/Conversations/MessagesSection";
import ProfileBar from "../../Components/Conversations/ProfileBar";
import TypingBar from "../../Components/Conversations/TypingBar";

// TODO: extract Converstation

export default function directMessage({ params }) {
	return (
		<div>
			<h1>{params.friendName}</h1>
		</div>
	);
}
