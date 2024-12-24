import { getUserById } from "./userService";

export const fetchFriends = async (userId) => {
  const user = await getUserById(userId);
    if (!user?.friendsIds || user.friendsIds.length === 0) return;
    
          try {
            const friendPromises = user.friendsIds.map(
              (friendId) => getUserById(friendId) // Fetch fiecare prieten după ID
            );
            const friendData = await Promise.all(friendPromises);
            return friendData;
          } catch (error) {
            console.error("Error fetching friend avatars:", error);
            throw error;
          }
}