import axios from "axios";

const API_BASE_URL = "http://localhost:8000/user-group";

export const pair = async (userId, groupId) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/pair/${userId}/${groupId}`);
        return response.data;
    }
    catch(error){
        console.error("Error pairing user with group: " + error.message);
    }
}

export const removePair = async (userId, groupId) => {
    try{
        await axios.post(`${API_BASE_URL}/remove/${userId}/${groupId}`);
    }
    catch(error){
        console.error("Error removing pair from group:", error);
        throw error;
    }
}

export const fetchUserGroupsIds = async (userId) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/groups/${userId}`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching user groups: " + error.message);
    }
}