import { create, deleteGr, getByCode, getById, update } from "../api/group";
import { deleteGroupDependencies, fetchUserGroupsIds, pair } from "../api/user-group";

export const createGroup = async (groupData, invitedUserIds) => {
    try{
        return await create(groupData, invitedUserIds);
    }
    catch(err){
        console.error(err);
    }
}
export const updateGroup = async (groupId, groupData) => {
    try{
        return await update(groupId, groupData);
    }
    catch(err){
        console.error(err);
    }
}
export const deleteGroup = async (groupId) => {
    try {
      await deleteGroupDependencies(groupId);
  
      // Șterge grupul propriu-zis
      return await deleteGr(groupId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
export const getGroupById = async (groupId) => {
    try{
        return await getById(groupId);
    }
    catch(err){
        console.error(err);
    }
}
export const getGroupByCode = async (joinCode) => {
    try{
        return await getByCode(joinCode);
    }
    catch(err){
        console.error(err);
    }
}

export const pairUserGroup = async (userId, groupId, participant) =>{
    try{
        return await pair(userId, groupId, participant);
    }
    catch(err){
        console.error(err);
    }
}

export const getUserGroups = async (userId) => {
    try {
      const ids = await fetchUserGroupsIds(userId);
  
      if (!ids || ids.length === 0) {
        return [];
      }
  
      const groupPromises = ids.map((groupId) =>
        getGroupById(groupId).catch(() => null) // Ignoră erorile la grupuri șterse
      );
      const groups = await Promise.all(groupPromises);
  
      // Filtrează grupurile valide
      return groups.filter((group) => group !== null);
    } catch (err) {
      console.error("Error fetching user groups:", err);
      throw err;
    }
  };

  

  