import React, { useState } from "react";

import { PopupSetup2Fa } from "../../(auth)/2Fa/Popup.jsx";
import SettingsSection from "./Components/SettingsSection";

function Settings(props) {
	const showSettings = props.showSettings;
	const [ShowQr, setShowQr] = useState();

	return (
		<div className="size-full absolute z-[3] top-0 flex items-center justify-center backdrop-blur-[5px]">
			{!ShowQr ? (
				<SettingsSection
					setShowQr={setShowQr}
					showSettings={showSettings}
				/>
			) : (
				<PopupSetup2Fa QrCode={ShowQr} setShowQr={setShowQr} />
			)}
		</div>
	);
}

export default Settings;
