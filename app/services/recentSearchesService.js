import { fetchRecentSearches, removeRecentSearch } from "../api/recent-searches"
import { getUserById } from "./userService";

export const getRecentSearches = async (userId) => {
    try {
        const ids = await fetchRecentSearches(userId);

        if (!ids || ids.length === 0) {
            return []; // Return an empty array if the user has no recent searches
        }

        // Map IDs to user data while filtering out nonexistent users
        const recentSearches = [];
        for (const id of ids) {
            const user = await getUserById(id);
            if (user && !user.blockedUsers.includes(userId)) {
                recentSearches.push(user);
            } else {
                // If user no longer exists, remove the ID from recent searches
                await removeRecentSearch(userId, id);
            }
        }

        return recentSearches;
    } catch (err) {
        console.error("Error fetching recent searches: " + err.message);
        return [];
    }
};


