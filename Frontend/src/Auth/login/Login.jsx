import React, { useEffect, useRef, useState } from "react";
import { settoken, getToken } from "../AuthTools/tokenManagment";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo-login.png";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const Form = useRef(null);
  const [error, setError] = useState();
  const [errorPassword, setErrorPassword] = useState();
  const [errorUsername, setErrorUsername] = useState();

  function welcomeRedirect() {
    navigate("/");
  }

 function showPassword(){
    let svg = document.getElementById("eyeIcon");
    let path = svg.querySelector("path");
    var PasswordInput = document.getElementById('password');
    //if the type of button is password swith it to text and vice-versa
    PasswordInput.type = (PasswordInput.type == 'text') ? 'password' : 'text';
    let color = (PasswordInput.type == 'text') ? '#00B6FF' :   '#8C8C8C';
    path.setAttribute("fill", color);
  }

  useEffect(() => {
    if (getToken()) {
      navigate("/home");
    }
  }, []);

  function errorInForm(funct) {
    //I change the state to true to re-render the componnents and disply the eroor section
    funct(true);
    setError(true);
    setTimeout(() => {
      //here i try to display error msg but only for 5s
      funct(false);
      setError(false);
    }, 5000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const FormField = Form.current;
    const username = FormField["username"].value.trim();
    const password = FormField["password"].value.trim();

    if (!username) {
      console.log("user name is empty");
      errorInForm(setErrorUsername);
      return;
    }
    if (!password) {
      console.log("password is empty");
      errorInForm(setErrorPassword);
      return;
    }

    const requestBody = {
      identifier: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
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
  };

  return (
    <>
      <svg
        onClick={welcomeRedirect}
        className="cross-vector"
        width="26"
        height="26"
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

      <div className="info">
        <img src={logo} className="logo" alt=""></img>
        <h1 className="h1-login">Login</h1>
      </div>
      <div className={error ? "error" : "hidden"}>
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
        <span>Error in Login Form!</span>
      </div>
      <form onSubmit={handleSubmit} ref={Form}>
        {/* <div className="input-container"> */}
        <div
          className={`input-container ${errorUsername ? "error-input" : ""}`}
        >
          <label className="label-input" htmlFor="username">
            Enter your username
          </label>
          <input
            className="input-button"
            required
            type="text"
            id="username"
            placeholder=""
          />
          <svg
            width="33"
            height="26"
            viewBox="0 0 33 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.1799 8.13574C6.05907 8.13574 2.71191 11.4829 2.71191 15.6037C2.71191 17.6479 3.5426 19.4965 4.87006 20.8484C4.88634 20.8647 4.88634 20.8729 4.90263 20.8891C6.22195 22.2085 7.94032 22.9658 9.78085 23.0554C9.78899 23.0554 9.78899 23.0554 9.79714 23.0554C9.846 23.0554 9.91115 23.0636 9.96002 23.0636C9.97631 23.0636 9.9763 23.0636 9.99259 23.0636C10.0577 23.0636 10.1148 23.0636 10.1799 23.0636C10.2451 23.0636 10.3102 23.0636 10.3672 23.0636C10.3835 23.0636 10.3835 23.0636 10.3998 23.0636C10.4487 23.0636 10.5138 23.0554 10.5627 23.0554C10.5708 23.0554 10.5708 23.0554 10.579 23.0554C12.4195 22.9577 14.146 22.1922 15.4572 20.8891C15.4735 20.8729 15.4735 20.8647 15.4897 20.8484C16.8254 19.4965 17.6479 17.6397 17.6479 15.6037C17.6397 11.491 14.2926 8.13574 10.1799 8.13574ZM10.1799 9.49578C13.5515 9.49578 16.2879 12.2403 16.2879 15.6037C16.2879 16.923 15.8644 18.1528 15.1477 19.1545C14.5206 18.0795 13.5759 17.2488 12.4602 16.7602C13.1443 16.1412 13.5759 15.2454 13.5759 14.2437C13.5759 12.3706 12.053 10.8477 10.1799 10.8477C8.3068 10.8477 6.78388 12.3706 6.78388 14.2437C6.78388 15.2373 7.21551 16.1331 7.8996 16.7602C6.78388 17.2488 5.83104 18.0795 5.2121 19.1545C4.49544 18.1528 4.07195 16.923 4.07195 15.6037C4.07195 12.2403 6.81646 9.49578 10.1799 9.49578ZM13.8365 20.4901C13.8284 20.4982 13.8202 20.4982 13.8202 20.5064C13.7877 20.5308 13.7551 20.5552 13.7225 20.5797C11.654 22.0293 8.71399 22.0293 6.63729 20.5797C6.60472 20.5552 6.57214 20.5308 6.53956 20.5064C6.53142 20.4982 6.52328 20.4982 6.52328 20.4901C6.40926 20.4087 6.30339 20.3109 6.18937 20.2213C6.8979 18.6577 8.45339 17.6316 10.1799 17.6316C11.9064 17.6316 13.4538 18.6577 14.1704 20.2213C14.0646 20.3191 13.9587 20.4087 13.8365 20.4901ZM8.14392 14.2437C8.14392 13.1198 9.05604 12.2077 10.1799 12.2077C11.3038 12.2077 12.2159 13.1198 12.2159 14.2437C12.2159 15.3676 11.3038 16.2797 10.1799 16.2797C9.05604 16.2797 8.14392 15.3676 8.14392 14.2437Z"
              fill="#8C8C8C"
            />
            <path
              d="M29.1798 10.856H19.684C19.3094 10.856 19.0081 11.1654 19.0081 11.5319C19.0081 11.8984 19.3175 12.2079 19.684 12.2079H29.1798C29.5545 12.2079 29.8558 11.8984 29.8558 11.5319C29.8558 11.1654 29.5626 10.856 29.1798 10.856Z"
              fill="#8C8C8C"
            />
            <path
              d="M29.1798 14.9277H19.684C19.3094 14.9277 19.0081 15.2372 19.0081 15.6037C19.0081 15.9783 19.3175 16.2796 19.684 16.2796H29.1798C29.5545 16.2796 29.8558 15.9702 29.8558 15.6037C29.8558 15.2372 29.5626 14.9277 29.1798 14.9277Z"
              fill="#8C8C8C"
            />
            <path
              d="M29.1798 19H19.684C19.3094 19 19.0081 19.3095 19.0081 19.6759C19.0081 20.0506 19.3175 20.3519 19.684 20.3519H29.1798C29.5545 20.3519 29.8558 20.0424 29.8558 19.6759C29.8558 19.3095 29.5626 19 29.1798 19Z"
              fill="#8C8C8C"
            />
            <path
              d="M29.1797 4.06382H20.3598V0.675947C20.3598 0.301326 20.0504 0 19.6839 0H14.2519C13.8773 0 13.5759 0.30947 13.5759 0.675947V4.07197H3.39602C1.52292 4.07197 0 5.58674 0 7.46799V22.404C0 24.2771 1.52292 25.8 3.39602 25.8H29.1797C31.0528 25.8 32.5757 24.2771 32.5757 22.404V7.45985C32.5757 5.58674 31.0528 4.06382 29.1797 4.06382ZM14.936 1.35189H19.0079V5.42386H14.936V1.35189ZM31.2239 22.3877C31.2239 23.5115 30.3117 24.4237 29.1879 24.4237H3.39602C2.27216 24.4237 1.36004 23.5115 1.36004 22.3877V7.45985C1.36004 6.33598 2.27216 5.42386 3.39602 5.42386H13.5759V6.09981C13.5759 6.47443 13.8854 6.77575 14.2519 6.77575H19.6758C20.0504 6.77575 20.3517 6.46629 20.3517 6.09981V5.42386H29.1716C30.2954 5.42386 31.2076 6.33598 31.2076 7.45985V22.3877H31.2239Z"
              fill="#8C8C8C"
            />
          </svg>
        </div>

        {/* <div className="input-container"> */}
        <div
          className={`input-container ${errorPassword ? "error-input" : ""}`}
        >
          <label className="label-input" htmlFor="password">
            Enter your Password
          </label>
          <input
            className="input-button"
            required
            type="password"
            id="password"
            placeholder=""
          />

          <svg onClick={showPassword}
            id="eyeIcon"
            width="24"
            height="14"
            viewBox="0 0 24 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0008 4.26479C14.7268 4.26479 16.9368 6.44412 16.9368 9.13238C16.9368 11.8208 14.7268 14 12.0008 14C9.27463 14 7.06469 11.8208 7.06469 9.13238C7.06469 6.44412 9.27463 4.26479 12.0008 4.26479ZM12.0008 6.09012C10.297 6.09012 8.91571 7.4522 8.91571 9.13238C8.91571 10.8126 10.297 12.1746 12.0008 12.1746C13.7046 12.1746 15.0858 10.8126 15.0858 9.13238C15.0858 7.4522 13.7046 6.09012 12.0008 6.09012ZM12.0008 0C17.6939 0 22.6085 3.83326 23.9721 9.20515C24.0962 9.6941 23.7949 10.1897 23.299 10.3122C22.8031 10.4345 22.3006 10.1374 22.1765 9.64835C21.0178 5.08418 16.8397 1.82536 12.0008 1.82536C7.15963 1.82536 2.98022 5.08698 1.82366 9.65395C1.69981 10.1429 1.19739 10.4403 0.701481 10.3183C0.205568 10.1961 -0.0960499 9.70068 0.0277958 9.2116C1.38902 3.83656 6.30514 0 12.0008 0Z"
              fill="#8C8C8C"
            />
          </svg>
        </div>
        <div className="remember-me">
          <input type="checkbox" id="rememberMe" name="rememberMe" />
          <label htmlFor="rememberMe">Remember me</label>
          <br></br>
        </div>
        <button className="submit-btn" type="submit">
          Submit
        </button>
        <div className="other-button">
          <button
            id="google-signin-button"
            className="other-method google"
          ></button>
          <button className="other-method intra"></button>
        </div>
        <div className="link-register">
          <span>What are you waiting For?</span>
          <Link className="link" to="/register">
            Create your account now
          </Link>
        </div>
      </form>
    </>
  );
}

export default Login;
