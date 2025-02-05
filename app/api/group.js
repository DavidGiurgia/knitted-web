import axios from "axios";

const API_BASE_URL = "http://192.168.0.103:8000/group";

export const create = async (groupData, invitedUserIds) => {
    try{
        const response = await axios.post(`${API_BASE_URL}`, {groupData, invitedUserIds});
        return await response.data;
    }
    catch(error){
        console.error("Error creating group:", error);
        throw error;
    }
}

export const update = async (groupId, groupData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/update/${groupId}`, groupData);
        return await response.data;
    }
    catch(error){
        console.error("Error updating group:", error);
        throw error;
    }
}

export const deleteGr = async (groupId) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/delete/${groupId}`);
        return await response.data;
    }
    catch(error){
        console.error("Error deleting group:", error);
        throw error;
    }
}

export const getById = async (groupId) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/${groupId}`);
        return await response.data;
    }
    catch(error){
        console.error("Error getting group by id:", error);
        throw error;
    }
}

export const getByCode = async (joinCode) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/code/${joinCode}`);
        return await response.data;
    }
    catch(error){
        console.error("Error getting group by join code:", error);
        throw error;
    }
}

export const checkCode = async (joinCode) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/check-code/${joinCode}`);
        return await response.data.isUnique;
    }
    catch(error){
        console.error("Error checking join code:", error);
        throw error;
    }
}

export const addParticipant = async (groupId, participant) => {
    try{
        await axios.post(`${API_BASE_URL}/add-participant/${groupId}`, {participant});
    }
    catch(error){
        console.error("Error adding user to group:", error);
    }
}

export const removeParticipant = async (groupId, participantId) => {
    try{
        await axios.post(`${API_BASE_URL}/remove-participant/${groupId}/${participantId}`);
    }
    catch(error){
        console.error("Error removing user from group:", error);
    }
}

export const updateParticipant = async (groupId, participant) => {
    try{
        await axios.post(`${API_BASE_URL}/update-participant/${groupId}`, {participant});
    }
    catch(error){
        console.error("Error updating user in group:", error);
    }
}

export const getParticipants = async (groupId) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/participants/${groupId}`);
        return await response.data;
    }
    catch(error){
        console.error("Error getting participants in group:", error);
        throw error;
    }
}