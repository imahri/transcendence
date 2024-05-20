import NavBar from "../navBar/NavBar";
import styles from "./styles/back.module.css";

function layout({ children }) {
	return (
		<>
			<NavBar />
			<div
				className={`relative w-full min-h-[calc(100vh-90px)] mt-[90px] flex h- justify-center items-center bg-no-repeat bg-cover bg-center ${styles.GameBk}`}
			>
				{children}
			</div>
		</>
	);
}

export default layout;
