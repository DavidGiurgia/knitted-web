import axios from "axios";

const API_BASE_URL = "http://192.168.0.103:8000/messages";

export const fetchMessagesByRoom = async (roomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/room/${roomId}`);
        return await response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error; // Asigură-te că această eroare este gestionată în `useEffect`
    }
  };

  export const getLastMessageForRoom = async (roomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/room/${roomId}/last`);
        return await response.data;
    } catch (error) {
      console.error("Error fetching last message:", error);
    }
  }
  