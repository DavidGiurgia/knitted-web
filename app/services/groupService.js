import { create, deleteGr, getByCode, getById, update } from "../api/group";
import { fetchUserGroupsIds, pair, removePair } from "../api/user-group";

export const createGroup = async (groupData) => {
    try{
        return await create(groupData);
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
export const deleteGroup = async (userId, groupId) => {
    try{
        await removePair(userId, groupId);
        return await deleteGr(groupId);
    }
    catch(err){
        console.error(err);
    }
}
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

export const pairUserGroup = async (userId, groupId) =>{
    try{
        return await pair(userId, groupId);
    }
    catch(err){
        console.error(err);
    }
}

export const getUserGroups = async (userId) => {
    try {
      // 1. Obține ID-urile grupurilor asociate utilizatorului
      const ids = await fetchUserGroupsIds(userId);
  
      if (!ids || ids.length === 0) {
        return []; // Dacă utilizatorul nu face parte din niciun grup
      }
  
      // 2. Obține detaliile fiecărui grup folosind `getGroupById`
      const groupPromises = ids.map((groupId) => getGroupById(groupId));
      const groups = await Promise.all(groupPromises);
  
      return groups; // Returnează lista completă a grupurilor
    } catch (err) {
      console.error("Error fetching user groups:", err);
      throw err; // Re-aruncă eroarea pentru a putea fi gestionată în altă parte
    }
  };

  