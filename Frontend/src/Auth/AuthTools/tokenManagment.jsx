import Cookies from 'js-cookie';
import { REFRESH_TOKEN_URL } from '../../URLS';


export function settoken(tokens) {

    Cookies.set('access_token', tokens.access, { sameSite: 'strict' });
    Cookies.set('refresh_token', tokens.refresh, { sameSite: 'strict' });
}

export function removeTokens(){
    Cookies.remove('refresh_token');
    Cookies.remove('access_token');
}

export function getToken(){
    return Cookies.get('access_token');
}
export function getRefreshToken(){
    return Cookies.get('refresh_token');
}

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function refreshToken(){

    console.log("refresh hhhhh");
    const refresh_token = Cookies.get('refresh_token');
    const body = {refresh : refresh_token};

    try {
        const respons = await fetch(REFRESH_TOKEN_URL, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        });
        if (respons.ok){
            const data = await respons.json();
            const access_token = data.access;
            Cookies.set('access_token', await access_token, { sameSite: 'strict' });
            return true;
        }
        else{
            console.error('response error : ', respons);
            return false;
        }
    }
    catch (error){
        console.error('network error : ', error);
        return false;
    }
}

export async  function refreshAndRefetch(refetshFunction, navig){
    if (await  refreshToken())
        await refetshFunction();
    else
        navigate(navig);
}