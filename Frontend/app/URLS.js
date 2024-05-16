export const BASE_URL = "http://localhost:8000";
const WS = "ws://localhost:8000";

const AUTH_APP = `${BASE_URL}/auth`;

export const LOGIN_URL = `${AUTH_APP}/login`;
export const REGISTER_URL = `${AUTH_APP}/register`;
export const REFRESH_TOKEN_URL = `${AUTH_APP}/refresh_token`;
export const LOGOUT_URL = `${AUTH_APP}/logout`;
export const VERIFY_TOKEN_URL = `${AUTH_APP}/verify_token`;

export const AUTH_42 = `${AUTH_APP}/42auth`;

export const TOWFACTOR_URL = `${AUTH_APP}/2FA`;
export const TOWFACTOR_QR_URL = `${AUTH_APP}/2FA/qrcode`;

const GAME_APP = `${BASE_URL}/Game`;

export const PADDLES_URL = `${GAME_APP}/padle`;
export const BOARDES_URL = `${GAME_APP}/board`;
export const BADGES_URL = `${GAME_APP}/badge`;
export const ITEMS_URL = `${GAME_APP}/items`;
export const MISSIONS_URL = `${GAME_APP}/missions`;
export const ACHEIVMENTS_URL = `${GAME_APP}/acheivement`;
export const MATCHES_URL = `${GAME_APP}/match`;
export const USER_APP = `${BASE_URL}/user`;

export const USER_URL = `${USER_APP}/`;
export const USER_SEARCH_URL = `${USER_APP}/search`;
export const GET_USER_URL = `${USER_APP}/user`;
export const POST_INFO_URL = `${USER_APP}/info`;
export const NOTIF_URL = `${USER_APP}/notification`;
export const MSGNOTIF_URL = `${USER_APP}/msgnotif`;

export const FRIENDSHIP_URL = `${USER_APP}/friendship`;

export const GET_5Friends_URL = `${USER_APP}/somefriends`;
export const GET_Friends_URL = `${USER_APP}/userfriends`;
export const Block_URL = `${USER_APP}/block`;

export const wsChat = `${WS}/ws/chat`;
