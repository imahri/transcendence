import React, { useEffect, useRef, useState } from "react";
import img from "../../Home/CodeQr.png";
import "./Popup.css";
import { getToken, settoken, refreshAndRefetch } from "../AuthTools/tokenManagment";
import { useNavigate } from "react-router-dom";

let numbers = "";


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

  const navigate = useNavigate();
  const [QrImage, setQrImage] =  useState("");


  useEffect(() => {
    async function req(){
        try {
          const response = await getCodeQr();
          if (response.ok){
            const responseBlob = await response.blob()
            const src = URL.createObjectURL(responseBlob);
            setQrImage(src);
          }
          else if (response.status == 401){
            refreshAndRefetch(req, '/login');
            // i Want to re-fetch should i call the function again or what
          }
          else {
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

  // console.log('code : ', code);
  // console.log('number : ', code);
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

    // const numbers = res.current;
    const username = props.username;

    // user name will be recived in props
    try{
      const response = await sendNumber(username, numbers);
      numbers = "";
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

  const [inputIndex, setIndex] = useState(1);
  function getnumber(e, index){
    const number = e.target.value;
    console.log(number);
   
    if (!number){
      if (index == 1 || document.getElementById((index - 1).toString()).value)
        return;
      setIndex(index - 1);
      return ;
    }
    if (isNaN(number)){
      document.getElementById(index.toString()).classList.add('error-input');
      return;
    }

    if (number)
      numbers += number;
    if (index != 6)
      setIndex(index + 1);
    
      document.getElementById('2').focus();
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
          <div className="allNumber">
            <div className="threeNumber">
              <input onChange={(e) => getnumber(e, 1)} type="text" maxLength="1" id="1" disabled={inputIndex != 1} autoFocus={inputIndex == 1} ></input>
              <input onChange={(e) => getnumber(e, 2)} type="text" maxLength="1" id="2" disabled={inputIndex != 2} autoFocus={inputIndex == 2}></input>
              <input onChange={(e) => getnumber(e, 3)} type="text" maxLength="1" id="3" disabled={inputIndex != 3} autoFocus={inputIndex == 3}></input>
            </div>
            <div className="threeNumber">
              <input onChange={(e) => getnumber(e, 4)} type="text" maxLength="1" id="4" disabled={inputIndex != 4} autoFocus={inputIndex == 4}></input>
              <input onChange={(e) => getnumber(e, 5)} type="text" maxLength="1" id="5" disabled={inputIndex != 5} autoFocus={inputIndex == 5}></input>
              <input onChange={(e) => getnumber(e, 6)} type="text" maxLength="1" id="6" disabled={inputIndex != 6} autoFocus={inputIndex == 6}></input>
            </div>
          </div>
          <button onClick={() => {submitNumber() }}>verify</button>
        </div>
      </div>
    </>
  );
}
