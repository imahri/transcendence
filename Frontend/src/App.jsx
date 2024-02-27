import Home from "./Home/Home";
import Login from "./Auth/login/Login";
import AuthWrapper from "./Auth/AuthWrapper";
import Register from "./Auth/register/Register";
import Welcome from "./Auth/welcome/Welcome";
import Chat from "./Chat/Chat";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: <AuthWrapper component={Welcome} />,
	},
	{
		path: "/login",
		element: <AuthWrapper component={Login} />,
	},
	{
		path: "/register",
		element: <AuthWrapper component={Register} />,
	},
	{
		path: "/home",
		element: <Home />,
	},
	{
		path: "/chat",
		element: <Chat />,
	},
	{
		path: "/about",
		element: <div>About</div>,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}
export default App;
