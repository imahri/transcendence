"use client";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { getToken } from "@/app/(auth)/AuthTools/tokenManagment";
import { UserContext } from "../../layout";

function updateStatus(e, socket, setNotif, setnbNotif, notif, setToastNotif) {
	const data = JSON.parse(e.data);
	console.log("Received message:", data);

	data.type == "nb_notif" ? setnbNotif(data.nb_notif) : "";
	data.type == "all_notif" ? setNotif(data.all_notif) : "";
	if (data.type == "update") {
		setToastNotif("yes");
		notif
			? getNotification(setNotif, notif, socket, 1)
			: getNbnotif(socket);
	}
}

function getNbnotif(socket) {
	socket.send(
		JSON.stringify({
			action: "check_nb_notif",
		}),
	);
}

export function initSocket(
	setSocket,
	setnbNotif,
	setNotif,
	notif,
	setToastNotif,
) {
	try {
		const token = getToken();
		const ws = new WebSocket(`ws://localhost:8000/ws/notif?token=${token}`);
		setSocket(ws);

		ws.onopen = () => {
			getNbnotif(ws);
		};

		ws.onmessage = (e) => {
			updateStatus(e, ws, setNotif, setnbNotif, notif, setToastNotif);
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
		ws.onclose = (event) => {
			console.log("WebSocket connection closed:", event.reason);
		};
	} catch (error) {
		console.error("Error creating WebSocket:", error);
	}
}

function getNotification(setNotif, notif, socket, ignore) {
	if (!socket) return;

	if (notif && !ignore) {
		setNotif(false);
		return;
	}

	socket.send(
		JSON.stringify({
			action: "get_notif",
		}),
	);
}

import IMG from "../../home/assets/profile.png";

const ChatSvg = (
	<svg
		className="absolute bottom-[-5px] right-[-5px]"
		width="20"
		height="20"
		viewBox="0 0 23 23"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M9.73077 0C4.35673 0 0 4.11884 0 9.2C0 11.8097 1.15719 14.1567 3.00458 15.8287C2.7396 16.7312 2.18686 17.6288 1.17142 18.4288C1.17085 18.4294 1.17027 18.43 1.1697 18.4305C1.08594 18.4637 1.01384 18.5225 0.962932 18.5992C0.912024 18.6759 0.884713 18.7668 0.884615 18.86C0.884615 18.982 0.931216 19.099 1.01416 19.1853C1.09711 19.2715 1.20962 19.32 1.32692 19.32C1.35715 19.3196 1.38725 19.316 1.41677 19.3092C3.13298 19.304 4.59729 18.5416 5.76209 17.586C6.31484 17.8198 6.89183 18.0126 7.49331 18.1466C7.22439 17.3554 7.07692 16.5131 7.07692 15.64C7.07692 11.074 11.0453 7.36 15.9231 7.36C17.1456 7.36 18.311 7.59358 19.3717 8.01586C18.756 3.49498 14.6793 0 9.73077 0ZM15.9231 9.2C14.0462 9.2 12.2461 9.8785 10.9189 11.0862C9.59176 12.294 8.84615 13.932 8.84615 15.64C8.84615 17.348 9.59176 18.986 10.9189 20.1938C12.2461 21.4015 14.0462 22.08 15.9231 22.08C16.8279 22.0787 17.7241 21.9195 18.5631 21.611C19.648 22.3992 20.9608 22.9838 22.4644 22.9892C22.495 22.9962 22.5263 22.9999 22.5577 23C22.675 23 22.7875 22.9515 22.8705 22.8653C22.9534 22.779 23 22.662 23 22.54C22.9999 22.4459 22.972 22.354 22.92 22.2769C22.8681 22.1998 22.7947 22.1411 22.7097 22.1088C21.9001 21.4695 21.3813 20.7659 21.0701 20.0495C22.3069 18.8569 22.9971 17.2798 23 15.64C23 13.932 22.2544 12.294 20.9272 11.0862C19.6 9.8785 17.8 9.2 15.9231 9.2Z"
			fill="white"
		/>
	</svg>
);

const GmaeSvg = (
	<svg
		className="absolute bottom-[-5px] right-[-5px]"
		width="20"
		height="20"
		viewBox="0 0 26 26"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M15.3839 0.00171103C12.6207 0.0507049 9.84348 1.15166 7.71298 3.28212C4.9336 6.06144 3.94528 9.92287 4.7194 13.4362C4.71138 13.5521 4.72369 13.6685 4.75575 13.7802C4.75575 13.7802 4.94562 14.4414 4.97514 15.2627C5.00466 16.0839 4.83713 16.9325 4.38967 17.3799C3.67794 18.0917 3.1424 18.4285 2.62157 18.7274C2.10073 19.0263 1.53465 19.2963 0.985875 19.8451C0.0978038 20.7332 -0.164252 21.8882 0.0953321 22.7659C0.354916 23.6436 0.928672 24.2276 1.35066 24.6495C1.77265 25.0715 2.35655 25.6453 3.2343 25.9048C4.11205 26.1643 5.26752 25.9015 6.15518 25.013C6.70336 24.4645 6.97412 23.8979 7.2729 23.3774C7.57184 22.8565 7.90737 22.321 8.6191 21.6093C9.06651 21.1621 9.91637 20.9957 10.7377 21.0251C11.559 21.0546 12.2202 21.2432 12.2202 21.2432C12.3327 21.2756 12.4501 21.2879 12.5668 21.2796C16.0793 22.0519 19.9397 21.0661 22.7185 18.2873C26.9796 14.027 27.1195 7.17938 22.9703 3.03028C20.8958 0.955744 18.147 -0.0472828 15.3839 0.00171103ZM2.69297 0.376874C2.38747 0.376874 2.08496 0.437045 1.80272 0.553951C1.52048 0.670857 1.26403 0.842209 1.04801 1.05822C0.831993 1.27424 0.660638 1.53068 0.543729 1.81292C0.426821 2.09516 0.366649 2.39765 0.366649 2.70314C0.366649 3.00863 0.426821 3.31113 0.543729 3.59337C0.660638 3.87561 0.831993 4.13205 1.04801 4.34807C1.26403 4.56408 1.52048 4.73543 1.80272 4.85234C2.08496 4.96924 2.38747 5.02941 2.69297 5.02941C2.99846 5.02941 3.30097 4.96924 3.58321 4.85234C3.86545 4.73543 4.1219 4.56408 4.33792 4.34807C4.55394 4.13205 4.72529 3.87561 4.8422 3.59337C4.95911 3.31113 5.01928 3.00863 5.01928 2.70314C5.01928 2.39765 4.95911 2.09516 4.8422 1.81292C4.72529 1.53068 4.55394 1.27424 4.33792 1.05822C4.1219 0.842209 3.86545 0.670857 3.58321 0.553951C3.30097 0.437045 2.99846 0.376874 2.69297 0.376874ZM6.71858 13.5258L12.4734 19.2804C12.4677 19.2804 12.4621 19.2804 12.4565 19.2804C12.233 19.2209 11.7243 19.0653 10.8091 19.0325C9.71655 18.9933 8.27332 19.136 7.20929 20.1995C6.35641 21.0524 5.87659 21.8034 5.54244 22.3856C5.2083 22.9677 5.02875 23.3212 4.74537 23.6045C4.74494 23.6045 4.7445 23.6045 4.74407 23.6045C4.22268 24.1264 4.07192 24.073 3.8003 23.9927C3.52869 23.9124 3.12076 23.5974 2.76177 23.2385C2.40278 22.8795 2.08792 22.4718 2.00753 22.1999C1.92714 21.9281 1.87401 21.7766 2.39568 21.2549C2.67906 20.9715 3.03249 20.7907 3.61466 20.4565C4.19683 20.1224 4.9466 19.6426 5.79948 18.7897C6.86346 17.7258 7.0071 16.2839 6.96783 15.1913C6.93496 14.2767 6.77823 13.7679 6.71858 13.5439C6.71864 13.5379 6.71864 13.5318 6.71858 13.5258Z"
			fill="white"
		/>
	</svg>
);

const FriendSvg = (
	<svg
		className="absolute bottom-[-5px] right-[-5px]"
		width="20"
		height="20"
		viewBox="0 0 20 25"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M10 0C6.55932 0 3.75 2.80933 3.75 6.25C3.75 9.69067 6.55932 12.5 10 12.5C13.4407 12.5 16.25 9.69067 16.25 6.25C16.25 2.80933 13.4407 0 10 0ZM2.8125 15C1.27031 15 0 16.2703 0 17.8125V18.562C0 20.4001 1.16545 22.0487 2.94312 23.1824C4.72079 24.316 7.15303 25 10 25C12.847 25 15.2792 24.316 17.0569 23.1824C18.8346 22.0487 20 20.4001 20 18.562V17.8125C20 16.2703 18.7297 15 17.1875 15H2.8125Z"
			fill="white"
		/>
	</svg>
);

function NotifSection({ notif }) {
	const Svg =
		notif.type == "Msg"
			? ChatSvg
			: notif.type == "friendShip"
				? FriendSvg
				: GmaeSvg;

	return (
		<div className=" w-full h-[70px] flex items-center gap-[10px] relative">
			<div className="relative">
				<Image
					className="size-[50px] rounded-full ml-[5px]"
					src={IMG}
					alt=""
				/>
				{Svg}
			</div>
			<div>
				<h1 className="text-white font-bold text-[15px]">
					admin admin
				</h1>
				{/* <h1 className='text-white font-bold'>{notif.notifier.username}</h1> */}
				<h2 className="text-[#7D7D7D] text-[13px]">
					Sent you a private Msg
				</h2>
				<h2 className="text-[#7D7D7D] text-[10px]">2 Days ago</h2>
			</div>
			<div
				className={`absolute size-[10px] bg-greatBlue rounded-full right-[10px] ${notif.is_read ? "hidden" : ""}`}
			></div>
		</div>
	);
}

function Notification() {
	const [notif, setNotif] = useState();
	const [nbNotif, setnbNotif] = useState();
	const [socket, setSocket] = useState();

	const { setToastNotif } = useContext(UserContext);

	useEffect(() => {
		initSocket(setSocket, setnbNotif, setNotif, notif, setToastNotif);

		return () => {
			if (socket) socket.close();
		};
	}, []);

	return (
		<div>
			<svg
				onClick={() => {
					getNotification(setNotif, notif, socket, 0);
				}}
				className="cursor-pointer"
				width="30"
				height="30"
				viewBox="0 0 34 42"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16.6667 0C14.9417 0 13.5417 1.4 13.5417 3.125V4.57357C8.15247 5.9627 4.16667 10.8433 4.16667 16.6667V29.1667L0.968425 31.5755H0.964355C0.668736 31.7638 0.42538 32.0235 0.256814 32.3308C0.0882469 32.6381 -8.31377e-05 32.9829 5.87164e-08 33.3333C5.87164e-08 33.8859 0.219494 34.4158 0.610195 34.8065C1.0009 35.1972 1.5308 35.4167 2.08333 35.4167H16.6667H31.25C31.8025 35.4167 32.3324 35.1972 32.7231 34.8065C33.1138 34.4158 33.3333 33.8859 33.3333 33.3333C33.3334 32.9829 33.2451 32.6381 33.0765 32.3308C32.908 32.0235 32.6646 31.7638 32.369 31.5755L29.1667 29.1667V16.6667C29.1667 10.8433 25.1809 5.9627 19.7917 4.57357V3.125C19.7917 1.4 18.3917 0 16.6667 0ZM12.5 37.5C12.5 39.7917 14.375 41.6667 16.6667 41.6667C18.9583 41.6667 20.8333 39.7917 20.8333 37.5H12.5Z"
					fill="#B7B7B7"
				/>
			</svg>
			<div className="size-5 bg-greatBlue rounded-full absolute top-0 left-4 flex justify-center items-center">
				<span className="text-white text-[13px]">{nbNotif}</span>
			</div>
			<div
				className={`w-[300px] bg-[#303030] absolute right-[150px] top-[50px] rounded-b-[20px] flex flex-col gap-[10px] ${notif ? "" : "hidden"}`}
			>
				<div className="flex justify-center items-center h-[50px] bg-greatBlue">
					<h1 className="text-white font-semibold"> Notification</h1>
				</div>
				<div className="max-h-[300px] mb-[20px] overflow-y-auto ">
					{notif &&
						notif.map((notif) => {
							return <NotifSection notif={notif} />;
						})}
				</div>
			</div>
		</div>
	);
}

export default Notification;
