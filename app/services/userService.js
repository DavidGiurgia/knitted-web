import { deleteNotification } from "../api/notifications";
import { deleteRecentList } from "../api/recent-searches";
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

        await deleteRecentList(id);

        const notifications = await getNotificationsForUser(id);
        notifications.forEach(async (notification) => {
            await deleteNotification(notification._id);
        });

        const userGroups = await getUserGroups(id);
        userGroups.forEach(async (group) => {
            await removePair(id, group._id);
        });

        userGroups.forEach(async (group) => {
            await deleteGroup(group._id);
        });
        
        await deleteUser(id);

    }
    catch(err){
        console.error(err);
    }
}