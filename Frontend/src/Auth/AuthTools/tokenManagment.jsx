import Cookies from 'js-cookie';


export function settoken(tokens) {

    Cookies.set('access_token', tokens.access, { sameSite: 'strict' });
    Cookies.set('refresh_token', tokens.refresh, { sameSite: 'strict' });

}

export function getToken(){
    return Cookies.get('access_token');
}

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}