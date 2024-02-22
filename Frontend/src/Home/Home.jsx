import React from "react";
import { json, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getToken, refreshAndRefetch, getRefreshToken, removeTokens } from "../Auth/AuthTools/tokenManagment";
import { PopupSetup2Fa, desactivate2FA } from "../Auth/FactorAuth/Popup";
import { LOGOUT_URL } from "../URLS";

import './Home.css'

function Home() {
 

  const [FactorAuth, setFactorAuth] = useState();
  const [popUp, setPopUp] = useState();
  const navigate = useNavigate();

  useEffect(()=> {
    if (!getToken())
      navigate("/");
  }, [])

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
      else if (response.status == 401){
          refreshAndRefetch(desactivate, '/login');
          // i Want to re-fetch should i call the function again or what
      }
      else{
        console.error("respons error :", response);
      }
    }
    catch (error){
      console.error("network error :" , error);
    }
  
  }

  async function logout(){
    
    try{
      const requestBody = {refresh: getRefreshToken()};
      const response = await fetch(LOGOUT_URL, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(requestBody)
      });
      if (response.ok){
          removeTokens();
          navigate('/');
      }
      else{
        console.error("response error :" , response);
      }
    }
    catch (error){
      console.error("network error :" , error);
    }
    



  }

  return (
    <>
      <div className="home-container">
        <h1> Welcome to the home</h1>

        {!FactorAuth ? (
          <button onClick={()=> setFactorAuth(true) }>Activate 2FA </button>
        ) : (
          <button onClick={desactivate}>Desactivate 2FA</button>
        )}

        {FactorAuth && <button onClick={showQr}>show Qr</button>}

        {popUp && <PopupSetup2Fa update={setPopUp} />}

        <button className="logout" onClick={logout}>Logout</button>
      </div>
    </>
  );
}

export default Home;