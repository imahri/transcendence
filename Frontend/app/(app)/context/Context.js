"use client";
import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

const data = [];

export const Wrapper = ({ children }) => {
	const [socket_, setSocket] = useState(null);

	return (
		<LayoutContext.Provider value={{ socket_, setSocket }}>
			{children}
		</LayoutContext.Provider>
	);
};

export const Provider = () => useContext(LayoutContext);
