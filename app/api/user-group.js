import axios from "axios";

const API_BASE_URL = "http://192.168.0.103:8000/user-group";

export const pair = async (userId, groupId, profile) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/pair/${userId}/${groupId}`, {profile});
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

export const getProfileByUserGroup = async (userId, groupId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/${userId}/${groupId}`);
      return response.data; // Verifică dacă acest câmp există
    } catch (error) {
      console.error("Error fetching nickname by user-group: " + error.message);
      return null;
    }
  };

export const updateProfileByUserGroup = async (userId, groupId, profile) => {
    try{
        await axios.post(`${API_BASE_URL}/update-profile/${userId}/${groupId}`, {profile});
    } catch(error){
        console.error("Error updating user-group nickname: " + error.message);
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

export const deleteGroupDependencies = async (groupId) => {
    try{
        await axios.post(`${API_BASE_URL}/delete-group/${groupId}`);
    } catch(error){
        console.error("Error deleting group dependencies: " + error.message);
    }
}

