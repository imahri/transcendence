import React, { useEffect, useRef, useState } from "react";
import "./Popup.css";
import { getToken, settoken, refreshAndRefetch } from "../AuthTools/tokenManagment";
import { TOWFACTOR_URL, TOWFACTOR_QR_URL } from "../../URLS";


export async function desactivate2FA(){
  const token = getToken();
  const response = await fetch(TOWFACTOR_URL, {
    method: 'DELETE',
    headers: {'Authorization': 'Bearer ' + token}
  });

  return response;

}
// still if the access token expire and if the qrCode is not found
// if the 2Fa is already activated

async function fetchCodeQr(){

  const token = getToken();
  const response = await fetch(TOWFACTOR_URL, {
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + token}
  });
  return response;
}

async function refetchCodeQr(){

  const token = getToken();
  const response = await fetch(TOWFACTOR_QR_URL, {
    headers: {'Authorization': 'Bearer ' + token}
  });
  return response;
}

async function getCodeQr(setQrImage, setError){
  try {
    const response = await fetchCodeQr();
    if (response.ok){
      const responseBlob = await response.blob()
      const src = URL.createObjectURL(responseBlob);
      setQrImage(src);
    }
    else if (response.status == 400){
      console.log(response)
       const secondResponse = await refetchCodeQr();
       if (!secondResponse.ok){
        setError(true);
        console.error('response error', response);
        return;  
       }
       const secondBlob = await secondResponse.blob();
       const secondSrc = URL.createObjectURL(secondBlob);
       setQrImage(secondSrc); // refactor function and check status of response 
    }
    else if (response.status == 401){
      refreshAndRefetch(getCodeQr, '/login');
      // i Want to re-fetch should i call the function again or what
    }
    else {
      setError(true);
      console.error('response error', response);
    }
  }
  catch (error) {
    setError(true);
    console.log("Network error:", error);
  }
}


export function PopupSetup2Fa(props) {

  const setPopUp = props.update;
  const [QrImage, setQrImage] =  useState("");
  const [error, setError] =  useState();

  useEffect(() => {getCodeQr(setQrImage, setError)} , [])

  return (
    <>
    <div className="popUpContainer">
      <div className="popUp width620px">
        <svg
          onClick={() => setPopUp(false)}
          className="close-popup"
          width="20"
          height="20"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.0807 13L25.3668 3.71137C26.2111 2.86695 26.2111 1.47774 25.3668 0.633316C24.5227 -0.211105 23.1338 -0.211105 22.2896 0.633316L13.0034 9.92195L3.7172 0.633316C2.873 -0.211105 1.48416 -0.211105 0.639958 0.633316C0.217858 1.05553 0 1.61393 0 2.17234C0 2.73075 0.217858 3.28916 0.639958 3.71137L9.92616 13L0.639958 22.2886C0.217858 22.7108 0 23.2693 0 23.8277C0 24.3861 0.217858 24.9445 0.639958 25.3667C1.48416 26.2111 2.873 26.2111 3.7172 25.3667L13.0034 16.0781L22.2896 25.3667C23.1338 26.2111 24.5227 26.2111 25.3668 25.3667C26.2111 24.5223 26.2111 23.1331 25.3668 22.2886L16.0807 13Z"
            fill="white"
            fillOpacity="0.29"
          />
        </svg>
        <h1>Tow Factor Authentication Setup</h1>
        <h2>1. Install Google Authenticator App</h2>
        <h2>2. Open the App and Scan the Qr Code </h2>
        {error && 
        <div className={error ? 'error-2Fa' : 'hidden'}>
        <svg
        width="16"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
        <path
          d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
          fill="white"
        />
        <path
          d="M14.5 25H17.5V22H14.5V25ZM14.5 6V19H17.5V6H14.5Z"
          fill="#FF0000"
        />
        </svg>
        <span>Can't Get the codeQr now ! try it later</span>
    </div>
    }
        {QrImage && <img src={QrImage} alt=""></img> }
        <h2>3. Click the button to finish setup</h2>
        <button onClick={() => setPopUp(false)}>ok</button>
      </div>
    </div>
    </>
  );
}



async function sendNumber(username, code){

  let params = new URLSearchParams();
  params.append('user', username);
  params.append('OTP', code);
  
  const url = TOWFACTOR_URL + '?' + params.toString();
  
  const response = await fetch(url);
  return response;
}

async function submitNumber(username, code, setErrorSubmit) {
  
  function error(){
    setErrorSubmit(true);
    setTimeout(() => setErrorSubmit(false) , 5000);
  }

  if (isNaN(code) || code.length != 6){
    error();
    return;
  }

  try{
    const response = await sendNumber(username, code);
    if (response.ok){
      const tokens = await response.json();
      settoken(tokens);
      console.log("login success");
      Navigate("/home");
    }
    else{
      error();
      console.log("error response :", response);
    }
  }
  catch (error){
    console.log("Network error : ",error)
  }
}

function setNumber(e, setError, setCode, setReady) {
  let number = e.target.value;
  setCode(number);      
  if (isNaN(number)){
    setError(true);
    setTimeout(() => setError(false) , 1000);
  }
  if (number.length == 6)
    setReady(true);
  else
    setReady(false);
}

export function PopupEnternumber(props) {
  
  const setPopUp = props.update;
  const username = props.username;
  const [error, setError] = useState();
  const [errorSubmit, setErrorSubmit] = useState();
  const [code, setCode] = useState();
  const [ready, setReady] = useState();

  return (
    <>
      <div className="popUpContainer">
        <div className="popUp width90">
          <svg
            onClick={() => setPopUp(false)}
            className="close-popup"
            width="20"
            height="20"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.0807 13L25.3668 3.71137C26.2111 2.86695 26.2111 1.47774 25.3668 0.633316C24.5227 -0.211105 23.1338 -0.211105 22.2896 0.633316L13.0034 9.92195L3.7172 0.633316C2.873 -0.211105 1.48416 -0.211105 0.639958 0.633316C0.217858 1.05553 0 1.61393 0 2.17234C0 2.73075 0.217858 3.28916 0.639958 3.71137L9.92616 13L0.639958 22.2886C0.217858 22.7108 0 23.2693 0 23.8277C0 24.3861 0.217858 24.9445 0.639958 25.3667C1.48416 26.2111 2.873 26.2111 3.7172 25.3667L13.0034 16.0781L22.2896 25.3667C23.1338 26.2111 24.5227 26.2111 25.3668 25.3667C26.2111 24.5223 26.2111 23.1331 25.3668 22.2886L16.0807 13Z"
              fill="white"
              fillOpacity="0.29"
            />
          </svg>
          <h1>Tow-Factor Authentication</h1>
          <h2>Enter the Code generated by your Authenticator App</h2>
          <div className={errorSubmit ? 'error-2Fa' : 'hidden'}>
          <svg
          width="16"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          >
          <path
            d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
            fill="white"
          />
          <path
            d="M14.5 25H17.5V22H14.5V25ZM14.5 6V19H17.5V6H14.5Z"
            fill="#FF0000"
          />
          </svg>
          <span>The code is inccorect!</span>
      </div>
          <div className='allNumber'>
              <input onChange={(e) => setNumber(e, setError, setCode, setReady)} className={error ? 'error-input' : ''} type="text" maxLength="6" autoFocus={true}/>
          </div>
          <button className={ready ? 'readySubmit' : 'notready'} onClick={() => {submitNumber(username, code, setErrorSubmit) }}>verify</button>
        </div>
      </div>
    </>
  );
}
