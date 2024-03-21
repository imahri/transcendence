import React, { useEffect, useState } from "react";
import styles from "./styles/Searchbar.module.css";
import { BASE_URL } from "@/app/URLS";

import Result from "./SearchBarUtils";

function SearchIcon() {
	return (
		<span className={styles.search_icon}>
			<svg className={styles.icon} viewBox="0 0 20 20">
				<path
					d="M11.9142 2.04179C9.19255 -0.680598 4.7637 -0.680598 2.04168 2.04179C-0.680559 4.76349 -0.680559 9.19268 2.04168 11.9146C4.67033 14.5433 8.89063 14.6327 11.6284 12.1844L12.1818 12.738C12.044 13.0908 12.1163 13.5065 12.4011 13.7914L15.3216 16.7119C15.7055 17.096 16.3282 17.096 16.7119 16.7119C17.096 16.3282 17.096 15.7056 16.7119 15.3213L13.7917 12.4014C13.5066 12.116 13.0908 12.0438 12.738 12.1818L12.1845 11.6282C14.6333 8.89051 14.543 4.67008 11.9142 2.04179ZM2.87591 11.0805C0.613961 8.81876 0.613961 5.13776 2.87591 2.87573C5.13766 0.613708 8.81842 0.613708 11.0803 2.87573C13.3423 5.13776 13.3423 8.81871 11.0803 11.0805C8.81842 13.3423 5.13766 13.3423 2.87591 11.0805Z"
					fill="#B4B4B4"
				/>
			</svg>
		</span>
	);
}

// TODO: handle backend
// TODO: review code & test
// TODO: handle responsive

let timeout;

async function searchForUsers(searchText, setResult) {
	try {
		let response = await fetch(
			`http://localhost:8000/user/search?search=${searchText}`,
		);
		if (response.ok) {
			const data = await response.json();
			console.log("data : ", data);
			setResult(data);
		} else {
			setResult(404);
		}
		console.log(response);
	} catch (error) {
		console.error("fetch error: " + error);
	}
}

export function Searchbar() {
	const [input, setInput] = useState();
	const [result, setResult] = useState();

	useEffect(() => {
		if (input) {
			console.log("==> {input}");
			clearTimeout(timeout);
			timeout = setTimeout(() => searchForUsers(input, setResult), 1000);
		}
	}, [input]);

	result ? console.log(result) : "";

	return (
		<div className={styles.container}>
			<label className={styles.label}>
				<input
					className={styles.search_input}
					placeholder="Search"
					type="text"
					onChange={(e) => {
						setInput(e.target.value);
					}}
					onBlur={() => {
						setResult();
					}}
				/>
				<SearchIcon />
			</label>

			<div
				className={`bg-[#303030] rounded-xl w-full top-[55px] absolute ${!result || !input ? "hidden" : ""}`}
			>
				<div className="m-[20px] flex flex-col gap-[10px] max-h-[280px] overflow-y-auto">
					{result == 404 && (
						<h1 class="text-white font-semibold truncate max-w-[250px] overflow-x-hidden">
							No result for :{" "}
							<span className="font-normal text-[14px]">
								{input}
							</span>
						</h1>
					)}

					{result &&
						result != 404 &&
						result.map((res) => {
							return <Result data={res} />;
						})}
				</div>
			</div>
		</div>
	);
}
