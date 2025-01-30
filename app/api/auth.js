import axios from "axios";
import { getToken } from "../services/tokenService";


const API_BASE_URL = 'http://localhost:8000/auth'; // API URL

export const registerUser = async (fullname, username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      fullname,
      username,
      email,
      password,
    });
    const { access_token } = response.data; // Token JWT primit de la server
    return access_token;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    const { access_token } = response.data; // Token JWT primit de la server
    return access_token;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getCurrentUserFromApi = async () => {
  const token = getToken();

  if (!token) throw new Error("No token found");

  try {
    const response = await axios.post(
      `${API_BASE_URL}/profile`,
      {}, // Corpul cererii (gol în cazul tău)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Returnează utilizatorul curent
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};