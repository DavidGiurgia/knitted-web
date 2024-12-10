import { fetchRecentSearches } from "../api/recent-searches"
import { getUserById } from "./userService";

export const getRecentSearches = async (userId) => {
    try{
        const ids = await fetchRecentSearches(userId);
        if (!ids || ids.length === 0) {
            return []; // Return an empty array if the user has no recent searches
        }
        const recentUsersSearched = ids.map(async (id) => await getUserById(id));
        const recentSearches = await Promise.all(recentUsersSearched);
  
      return recentSearches; // Returnează lista completă a grupurilor
    }

    catch(err){
        console.error("Error fetching recent searches: " + err.message);
    }
}

