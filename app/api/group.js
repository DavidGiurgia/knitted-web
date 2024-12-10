import axios from "axios";

const API_BASE_URL = "http://localhost:8000/group";

export const create = async (groupData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}`, groupData);
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