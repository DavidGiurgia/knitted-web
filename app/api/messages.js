import axios from "axios";

const API_BASE_URL = "http://localhost:8000/messages";

export const fetchMessagesByRoom = async (roomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/room/${roomId}`);
        return await response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error; // Asigură-te că această eroare este gestionată în `useEffect`
    }
  };
  