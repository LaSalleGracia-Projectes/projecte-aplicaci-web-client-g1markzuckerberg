import Cookies from "js-cookie"

const COOKIE_EXPIRATION = 7

const COOKIE_OPTIONS = {
  expires: COOKIE_EXPIRATION,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
}

export const TOKEN_COOKIE_NAME = "auth_token"
export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token"

/**
 * Guarda el token de autenticación en una cookie
 * @param {string} token - Token JWT
 */
export const setAuthToken = (token) => {
  Cookies.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS)
}

/**
 * Guarda el token de refresco en una cookie
 * @param {string} refreshToken - Token de refresco
 */
export const setRefreshToken = (refreshToken) => {
  Cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, COOKIE_OPTIONS)
}


export const getAuthToken = () => {
  return Cookies.get(TOKEN_COOKIE_NAME)
}


export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_COOKIE_NAME)
}

export const clearAuthCookies = () => {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" })
  Cookies.remove(REFRESH_TOKEN_COOKIE_NAME, { path: "/" })
}
