import React from "react";
import { useState, useEffect } from "react";

import { PopupSetup2Fa } from "../Auth/FactorAuth/Popup";




function Home() {
 

  const [FactorAuth, setFactorAuth] = useState();
  const [popUp, setPopUp] = useState();

  function showQr() {
    setPopUp(true);
  }

  return (
    <>
      <div >
        <h1> Welcome to the home</h1>

        {!FactorAuth ? (
          <button onClick={() => setFactorAuth(true)}>Activate 2FA </button>
        ) : (
          <button onClick={() => setFactorAuth(false)}>Desactivate 2FA</button>
        )}

        {FactorAuth && <button onClick={showQr}>show Qr</button>}

        {popUp && <PopupSetup2Fa update={setPopUp} />}

        <div>
          <h2>Test</h2>
          <h2>Test</h2>
          <h2>Test</h2>
        </div>
      </div>
    </>
  );
}

export default Home;
