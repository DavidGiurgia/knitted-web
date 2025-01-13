import axios from "axios";

const API_BASE_URL = "http://localhost:8000/rooms";

export const createRoom = async (participants) => {
    console.log('Sending data:', { participants });
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, { participants });
        return response.data;
    } catch (error) {
        console.error("Error creating room:", error);
        throw error;
    }
};

export const getRoom = async (participants) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get`, { data: { participants } });
        return response.data;
    } catch (error) {
        console.error("Error fetching room:", error);
        throw error;
    }
};

export const fetchRoomsForUser = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
};

export const getParticipantsForRoom = async (roomId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/participants/${roomId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching participants:", error);
        throw error;
    }
};
