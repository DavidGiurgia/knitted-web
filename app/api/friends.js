import axios from "axios";

const API_BASE_URL = "http://localhost:8000/friends";


export const request = async (senderId, receiverId) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/request`, { senderId, receiverId });
        return response.data;
    }
    catch(error){
        console.error("Error sending friend request:", error);
        throw error;
    }
}

export const acceptFriendRequest = async (userId, senderId) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/accept`, { userId, senderId });
        return response.data;
    }
    catch(error){
        console.error("Error responding to friend request:", error);
        throw error;
    }
}

export const cancelFriendRequest = async (userId, senderId) => {
    try{
        await axios.post(`${API_BASE_URL}/cancel`, { userId, senderId });
    }
    catch(error){
        console.error("Error canceling friend request:", error);
    }
}

export const  blockUser = async (userId, blockedUserId) => {
    try{
        await axios.post(`${API_BASE_URL}/block`, { userId, blockedUserId });
    }
    catch(error){
        console.error("Error blocking user:", error);
    }
}

export const getFriendsAndRelations = async (userId) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        return response.data;
    }
    catch(error){
        console.error("Error fetching friends and relations:", error);
    }
}