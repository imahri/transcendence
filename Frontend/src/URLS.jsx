


const BASE_URL = "http://localhost:8000";

const AUTH_APP = `${BASE_URL}/auth`;

export const LOGIN_URL = `${AUTH_APP}/login`;
export const REGISTER_URL = `${AUTH_APP}/register`;
export const REFRESH_TOKEN_URL = `${AUTH_APP}/refresh_token`;

export const TOWFACTOR_URL = `${AUTH_APP}/2FA`;
export const TOWFACTOR_QR_URL = `${AUTH_APP}/2FA/qrcode`;

