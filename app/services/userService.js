import { deleteNotification } from "../api/notifications";
import { clearRecentSearch } from "../api/recent-searches";
import { deleteUser, fetchUserById } from "../api/user";
import { removePair } from "../api/user-group";
import { deleteGroup, getUserGroups } from "./groupService";
import { getNotificationsForUser } from "./notifications";

export const getUserById = async (id) => {
    try{
        return await fetchUserById(id);
    }
    catch(err){
        console.error(err);
    }
}
export const deleteUserAccount = async (id) => {
    try{
        const notifications = await getNotificationsForUser(id);
        notifications.forEach(async (notification) => {
            await deleteNotification(notification.id);
        });

        await clearRecentSearch(id);

        const userGroups = await getUserGroups(id);
        userGroups.forEach(async (groupId) => {
            await removePair(id, groupId);
        });

        userGroups.forEach(async (groupId) => {
            await deleteGroup(groupId);
        });
        
        await deleteUser(id);

    }
    catch(err){
        console.error(err);
    }
}