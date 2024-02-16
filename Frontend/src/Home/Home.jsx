import React from "react";
import { useState, useEffect } from "react";

import { PopupSetup2Fa, desactivate2FA } from "../Auth/FactorAuth/Popup";




function Home() {
 

  const [FactorAuth, setFactorAuth] = useState();
  const [popUp, setPopUp] = useState();

  function showQr() {
    setPopUp(true);
  }

  async function desactivate(){
    
    try{
      const response = await desactivate2FA();
      if (response.ok){
        console.log('2FA turn off successfully"');
        setFactorAuth(false);
      }
      else{
        console.error("respons error :", response);
      }
    }
    catch (error){
      console.error("network error :" , error);
    }

    
  }

  return (
    <>
      <div >
        <h1> Welcome to the home</h1>

        {!FactorAuth ? (
          <button onClick={()=> setFactorAuth(true) }>Activate 2FA </button>
        ) : (
          <button onClick={desactivate}>Desactivate 2FA</button>
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
