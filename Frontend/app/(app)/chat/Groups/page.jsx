"use client";
import { NoConv } from "../Components/Conversations/NoConv";
import { useContext } from "react";
import { ConvChatContext } from "../context/context";

export default function Groups() {
	const [activeConv, setActiveConv] = useContext(ConvChatContext);
	setActiveConv(null);
	return <NoConv />;
}
