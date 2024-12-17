import axios from "axios";

const API_BASE_URL = "http://localhost:8000/users";

export const fetchUserById = async (id) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching user by id:", error);
    }
}

export const searchUser = async (searchText) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/search/${searchText}`);
        return response.data;
    }
    catch(error){
        console.error("Error searching users:", error);
    }
}

export const updateUser = async (userId, fullname, username, bio, avatarUrl, deleteAvatarUrl) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/update/${userId}`, { fullname, username, bio, avatarUrl, deleteAvatarUrl });
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

  