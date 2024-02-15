import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getToken } from '../AuthTools/tokenManagment';

import logo from "../assets/logo-login.png";


function Welcome() {

    const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate("/home");
    }
  }, []);

  // useLayoutEffect(()=>{
  //   if (getToken()){
  //     navigate("/home");
  //   }
  // }, []);


  const get42Token = async (code) =>{

    let body = {code: code}
    try{
        const response = await fetch("http://localhost:8000/Auth/42",{
          method: 'POST',
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify(body),
        });
    
        if (response.ok) {
          const tokens = await response.json();
          settoken(tokens);
          console.log("Login successful");
          navigate("/home");
        } else {
          console.error("Login failed");
        }
    } catch (error) {
      console.error("Network error:", error);
  }

  

  }

  useEffect(()=>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let code = urlParams.get('code');

    if (code){
      console.log('code', code)
      get42Token(code)  
    }

  }, [])

  

  const handel42 = async (e) =>{
    e.preventDefault();
    
    const externalUrl = 'https://api.intra.42.fr/oauth/authorize';  
    const params = {
      client_id : "u-s4t2ud-ef24706709b2ebced52c2f14a643d130751366c3ebabc309cb18be033c4f8259",
      redirect_uri : "http://localhost:8080/login",
      response_type: 'code',
    };

      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
  
      const redirectUrl = `${externalUrl}?${queryString}`;      
      window.location.href = redirectUrl;
  }


  function Tologin(){
    navigate("/login");
  }
  function Toregister(){
    navigate("/register");
  }

  return (
<>
    <div className="info">
        <img src={logo} className="logo" alt=""></img>
        <h1 className="h1-register">
          Welcome to <br /> Paddel <span>Ghost</span>
        </h1>
    </div>
    <button className='submit-btn' onClick={Tologin}>Sign In</button>
    <button className='submit-btn' onClick={Toregister}>Sign Up</button>
    <div className="other-button">
          <button className="other-method google"></button>
          <button className="other-method intra" onClick={handel42}></button>
        </div>
        </>
    )
}

export default Welcome