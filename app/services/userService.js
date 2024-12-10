import { fetchUserById } from "../api/user";

export const getUserById = async (id) => {
    try{
        return await fetchUserById(id);
    }
    catch(err){
        console.error(err);
    }
}