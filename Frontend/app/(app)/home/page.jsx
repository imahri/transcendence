import NavBar from "../navBar/NavBar.jsx";
import Profile from "./Components/Profile";
import Dashboard from "./Components/Dashboard";

function Home() {
	return (
		<>
			<NavBar />
			<div className="mt-[100px] w-[100%] flex flex-col items-center gap-[20px] [@media(max-width:900px)]:mb-[90px]">
				<Profile />
				<Dashboard />
			</div>
		</>
	);
}
export default Home;
