import axios from "axios";

const API_BASE_URL = "http://localhost:8000/friends";


export const request = async (senderId, receiverId) => {
    try{
        const response =  await axios.post(`${API_BASE_URL}/request`, { senderId, receiverId });
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

export const cancelFriendRequest = async (senderId, receiverId) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/cancel`, { senderId, receiverId });
        return response.data;
    }
    catch(error){
        console.error("Error canceling friend request:", error);
    }
}

export const  blockUser = async (userId, blockedUserId) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/block`, { userId, blockedUserId });
        return response.data;
    }
    catch(error){
        console.error("Error blocking user:", error);
    }
}

export const unblockUser = async (userId, blockedUserId) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/unblock`, { userId, blockedUserId });
        return response.data;
    }
    catch(error){
        console.error("Error unblocking user:", error);
    }
}

export const removeFriend = async (userId, friendId) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/remove`, { userId, friendId });
        return response.data;
    }
    catch(error){
        console.error("Error removing friend:", error);
    }
}
