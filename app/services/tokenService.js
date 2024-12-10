export const getToken = () => localStorage.getItem("authToken");

export const setToken = (token) => localStorage.setItem("authToken", token);

export const removeToken = () => localStorage.removeItem("authToken");


import {jwtDecode} from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now(); // Verifică dacă a expirat
  } catch {
    return true; // În caz de eroare, considerăm token-ul expirat
  }
};
