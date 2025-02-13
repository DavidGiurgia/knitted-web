import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/recent-searches`;

export const fetchRecentSearches = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent searches:", error);
  }
};

export const addRecentSearch = async (userId, recentUserId) => {
  try {
    await axios.post(`${API_BASE_URL}/${userId}`, { recentUserId });
  } catch (error) {
    console.error("Error adding to recent searches:", error);
  }
};

export const removeRecentSearch = async (userId, recentUserId) => {
  try {
    await axios.post(`${API_BASE_URL}/remove/${userId}`, { recentUserId });
  } catch (error) {
    console.error("Error removing from recent searches:", error);
  }
}

export const clearRecentSearch = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${userId}`);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
};

export const deleteRecentList = async (userId) => {
  try{
    await axios.delete(`${API_BASE_URL}/delete-list/${userId}`);
  }
  catch(error){
    console.error("Error deleting recent list:", error);
  }
}