import { useContext, useState, useRef } from "react";
import { UserContext } from "@/app/(app)/context";
import { closePopopupSvg } from "@/app/(auth)/2Fa/Popup";
import Image from "next/image";
import { errorSvg, nameInputSvg } from "@/app/(auth)/Allsvg";
import { ChangeInfo } from "./EditUtils";
import Loading from "@/app/(auth)/Loading";
import { APIs } from "@/Tools/fetch_jwt_client";

function InputContainer({ type, label, id, placeHolder, error }) {
	return (
		<div
			className={`w-full h-[60px] bg-[#252525] rounded-[5px] pt-[5px] flex ${error ? "animate-shake" : ""}`}
		>
			<label
				className="absolute text-[#8C8C8C] text-sm mt-[-2px] ml-[19px]"
				htmlFor={id}
			>
				{label}
			</label>
			<input
				className="w-full bg-transparent pt-[2px] focus:outline-none text-white text-[14px] pl-[20px] placeholder:text-white"
				required={type == "password"}
				type={type}
				id={id}
				placeholder={placeHolder}
			/>
			{nameInputSvg}
		</div>
	);
}

function UploadSvg() {
	return (
		<div className="absolute top-0 rounded-full w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 hover:backdrop-brightness-50 cursor-pointer">
			<svg
				width="30"
				height="40"
				viewBox="0 0 46 42"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M4.16667 0C1.88945 0 0 1.88945 0 4.16667V29.1667C0 31.4439 1.88945 33.3333 4.16667 33.3333H20.8333V29.1667H4.16667V4.16667H37.5V16.6667H41.6667V4.16667C41.6667 1.88945 39.7772 0 37.5 0H4.16667ZM26.0417 14.5833L18.75 22.9167L13.5417 17.7083L7.86947 25H29.1667V18.75L26.0417 14.5833ZM33.3333 20.8333V29.1667H25V33.3333H33.3333V41.6667H37.5V33.3333H45.8333V29.1667H37.5V20.8333H33.3333Z"
					fill="white"
				/>
			</svg>
		</div>
	);
}

function displayNewImage(e, setnewImage) {
	const uploadedImage = e.target.files[0];
	const reader = new FileReader();
	reader.onload = () => {
		setnewImage(reader.result);
	};
	reader.readAsDataURL(uploadedImage);
}

function EditProfile({ closePopup }) {
	const Form = useRef(null);

	const [error, setError] = useState();
	const { user, setUser } = useContext(UserContext);
	const [image, setImage] = useState(APIs.image(user.img));
	const [isLoading, setLoading] = useState();

	return (
		<div className="size-full fixed z-[3] top-0 flex items-center justify-center backdrop-blur-[5px]">
			<div className="w-[600px] max-[650px]:w-[80%] p-[20px] bg-[#343434] rounded-[25px] relative shadow-lg flex flex-col gap-[20px] items-center">
				{closePopopupSvg(closePopup)}
				<h1 className="font-Chakra font-semibold text-[24px] text-[#BABABA]">
					Edit Profile
				</h1>

				<form
					className="w-[90%] flex flex-col items-center gap-[20px]"
					ref={Form}
					onSubmit={(e) =>
						ChangeInfo(
							e,
							Form,
							user.username,
							setError,
							setUser,
							closePopup,
							setLoading,
						)
					}
				>
					<label htmlFor="profile" className="relative">
						<Image
							src={image}
							width={100}
							height={100}
							className="rounded-full size-[100px] hover:opacity-[40%]"
							alt="profile Image"
						/>
						<UploadSvg />
					</label>
					<input
						onChange={(e) => displayNewImage(e, setImage)}
						type="file"
						accept="image/png"
						id="profile"
						className="hidden"
					/>

					<div
						className={
							error
								? "animate-shake bg-red-600 mx-[50px] w-[90%] rounded-[5px] flex justify-center items-center"
								: "hidden"
						}
					>
						{errorSvg}
						<span className="p-[5px] text-white">
							Error : {error?.msg}
						</span>
					</div>

					<InputContainer
						type={"text"}
						id={"firstname"}
						label={"Change your firstname"}
						placeHolder={user.first_name}
						error={error?.type == "first_name"}
					/>
					<InputContainer
						type={"text"}
						id={"lastname"}
						label={"Change your lastname"}
						placeHolder={user.last_name}
						error={error?.type == "last_name"}
					/>
					<button
						className="w-[138px] h-[37px] bg-green-500 bg-opacity-70 rounded-[10px]  font-bold text-[16px] cursor-pointer text-white relative"
						type="submit"
					>
						save
						{isLoading && <Loading style={"rounded-[10px]"} />}
					</button>
				</form>
			</div>
		</div>
	);
}

export default EditProfile;
