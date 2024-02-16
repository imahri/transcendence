import React, { useEffect, useRef, useState } from "react";
import "./Popup.css";
import { getToken, settoken } from "../AuthTools/tokenManagment";
import { Navigate } from "react-router-dom";


export async function desactivate2FA(){
  const token = getToken();

  const response = await fetch('http://localhost:8000/auth/2FA', {
    method: 'DELETE',
    headers: {'Authorization': 'Bearer ' + token}
  });

  return response;

}



// still if the access token expire and if the qrCode is not found
// if the 2Fa is already activated

async function getCodeQr(){

  const token = getToken();
  const response = await fetch('http://localhost:8000/auth/2FA', {
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + token}
  });
  return response;
} 


export function PopupSetup2Fa(props) {


  const [QrImage, setQrImage] =  useState("");


  useEffect(() => {
    async function req(){
        try {
          const response = await getCodeQr();
          if (response.ok){
            const responseBlob = await response.blob()
            console.log("blob :", responseBlob);
            const src = URL.createObjectURL(responseBlob);
            console.log("url :", src)
            setQrImage(src);
          }
          else{
            console.error('response error', response);
          }
        }
        catch (error) {
          console.log("Network error:", error);
        }
      }
      //send a post methode to the server and wait for Code Qr to render it 
  
      req();

  }, [])

  const setPopUp = props.update;
  return (


    <div className="popUpContainer">
      <div className="popUp">
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
        {QrImage && <img src={QrImage} alt=""></img> }
        <h2>3. Click the button to finish setup</h2>
        <button onClick={() => setPopUp(false)}>ok</button>
      </div>
    </div>
  );
}

async function sendNumber(username, code){

  let params = new URLSearchParams();
  params.append('user', username);
  params.append('OTP', code);
  
  const url = 'http://localhost:8000/auth/2FA?' + params.toString();
  
  const response = await fetch(url);
  return response;
}

export function PopupEnternumber(props) {
  
  const setPopUp = props.update;
  const res = useRef(null);



  async function submitNumber(){

    const numbers = res.current;
    const username = props.username;

    // user name will be recived in props
    try{
      const response = await sendNumber(username, numbers.value);

      if (response.ok){
        const tokens = await response.json();
        settoken(tokens);
        console.log("login success");
        Navigate("/home");

      }else{
        console.log("error response :", response);
      }

    }
    catch (error){
      console.log("Network error : ",error)
    }

    setPopUp(false); 
  }
  
  return (
    <>
      <div className="popUpContainer">
        <div className="popUp">
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
          <input ref={res} type="text" />
          <button onClick={() => {submitNumber() }}>verify</button>
        </div>
      </div>
    </>
  );
}
