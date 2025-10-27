import { API_EMPLOYEE_LOGIN, API_LOGOUT, API_VERIFY_TOKEN } from "../common/api/constants";

export default {
    meEndpoint: API_VERIFY_TOKEN,
    loginEndpoint: API_EMPLOYEE_LOGIN,         // '/jwt/login',
    logoutEndpoint: API_LOGOUT,
    storageTokenKeyName: 'refreshToken',
    onTokenExpiration: 'refreshToken', // logout | refreshToken
    accessToken: 'accessToken',
    permission: 'abilities' // logout | refreshToken
}
