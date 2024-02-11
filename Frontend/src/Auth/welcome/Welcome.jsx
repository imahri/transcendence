import React, { useEffect } from 'react';
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
          <button className="other-method intra"></button>
        </div>
        </>
    )
}

export default Welcome