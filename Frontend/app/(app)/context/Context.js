"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../context";

const LayoutContext = createContext();

const data = [];

export const Wrapper = ({ children }) => {
	const [socket_, setSocket] = useState(null);

	const { setUpdate } = useContext(UserContext);
	useEffect(() => {
		return () => setUpdate(true);
	}, []);

	return (
		<LayoutContext.Provider value={{ socket_, setSocket }}>
			{children}
		</LayoutContext.Provider>
	);
};

export const Provider = () => useContext(LayoutContext);
