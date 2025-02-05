import axios from "axios";

const API_BASE_URL = "http://192.168.0.103:8000/users";

export const fetchUserById = async (id) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching user by id:", error);
    }
}

export const searchUser = async (searchText, userId) => {
    try {
        // Trimite `userId` ca parametru query și `searchText` în URL
        const response = await axios.get(`${API_BASE_URL}/search/${searchText}`, {
            params: { userId }  // Adăugăm `userId` în query params
        });
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
}


export const updateUser = async (userId, bio, avatarUrl, deleteAvatarUrl, coverUrl, deleteCoverUrl) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/update/${userId}`, { bio, avatarUrl, deleteAvatarUrl, coverUrl, deleteCoverUrl });
        return response.data;
    }
    catch(error){
        console.error("Error updating user:", error);
    }
}

export const deleteUser = async (userId) => {
    try{
        await axios.delete(`${API_BASE_URL}/delete/${userId}`);
    }
    catch(error){
        console.error("Error deleting user:", error);
    }
}

  