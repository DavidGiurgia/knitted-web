"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserFromApi, loginUser, registerUser } from "../api/auth";
import { getToken, removeToken, setToken } from "../services/tokenService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Previne redirecționările premature
  const router = useRouter();

  const fetchProfile = async () => {
    const token = getToken();

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await getCurrentUserFromApi();

      if (profile) {
        setUser(profile);
        console.log(profile);
        setIsAuthenticated(true);

        router.push("/"); 
      } else {
        setIsAuthenticated(false);
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      console.error("Eroare la fetch-ul profilului:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Verificare sesiune (autentificare automată la încărcarea aplicației)
  useEffect(() => {
    fetchProfile();
  }, []);

  // Funcție pentru înregistrare
  const register = async (username, email, password) => {
    try {
      const token = await registerUser(username, email, password);

      if (token) {
        setToken(token); // Salvează token-ul în localStorage
        await fetchProfile(); // Reîncarcă profilul utilizatorului
        router.push("/"); // Redirecționează utilizatorul
      } else {
        throw new Error("Înregistrare eșuată");
      }
    } catch (error) {
      console.error("Eroare la înregistrare:", error);
    }
  };

  // Funcție pentru login
  const login = async (email, password) => {
    try {
      const token = await loginUser(email, password);

      if (token) {
        setToken(token); // Salvează token-ul în localStorage
        await fetchProfile(); // Reîncarcă profilul utilizatorului
        router.push("/"); // Redirecționează utilizatorul

        return true;
      } else {
        throw new Error("Autentificare eșuată");
      }
    } catch (error) {
      console.error("Eroare la login:", error);
      return false;
    }
  };

  // Funcție pentru logout
  const logout = () => {
    router.push("/login");
    removeToken(); // Șterge token-ul din localStorage
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        register,
        login,
        logout,
        loading,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
