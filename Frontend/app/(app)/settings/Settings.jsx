import React, { useState } from "react";

import { PopupSetup2Fa } from "../../(auth)/2Fa/Popup.jsx";
import SettingsSection from "./Components/SettingsSection";
import BlockedUsers from "./Components/BlockedUsers.jsx";

function Settings(props) {
	const showSettings = props.showSettings;
	const [ShowQr, setShowQr] = useState();
	const [ShowBlocked, setShowBlocked] = useState();

	return (
		<div className="size-full absolute z-[3] top-0 flex items-center justify-center backdrop-blur-[5px] shadow-[0_4px_40px_5px_rgba(0,0,0,0.7)]">
			{!ShowQr && !ShowBlocked && (
				<SettingsSection
					setShowQr={setShowQr}
					showSettings={showSettings}
					showBlocked={setShowBlocked}
				/>
			)}

			{ShowQr && !ShowBlocked && (
				<PopupSetup2Fa QrCode={ShowQr} setShowQr={setShowQr} />
			)}

			{ShowBlocked && <BlockedUsers setPopUp={setShowBlocked} />}
		</div>
	);
}

export default Settings;
