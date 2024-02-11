import {getToken }from "../Auth/AuthTools/tokenManagment";
import React  from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const auth = async () => {
    try {
        const token = getToken();
        if (!token){
            return false;
        } 
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        console.log("header : ", myHeaders);
        const response = await fetch('http://localhost:8000/Auth/home/', {
            credentials: 'include',
            headers: myHeaders,
        });

        if (response.ok) {
            let data = await response.json();
            console.log('Authentication successful');
            return data;
        } else {
            console.error('Authentication failed');
            return false;
        }
    } catch (error) {
        console.error('Network error:', error);
        return false;
    }
}

function Home() {

    const navigate = useNavigate();
    const [token] = useState(getToken());

    const [authenticated, setAuthenticated] = useState(false);
      
    useEffect(() => {
        if (!token)
            navigate('/');
    }, []);

     useEffect(() => {
        const authenticate = async () => {
            const isAuthenticated = await auth();
            setAuthenticated(isAuthenticated);
        };
        authenticate();
        if (authenticated)
            navigate("/");
    }, []);

    return (
            <>
                <div>Home</div>
                <h2>hello   :
                    <span>{  authenticated.first_name }  </span>  aka:  <span></span>{authenticated.username}</h2>
            </>
    );
}

export default Home;