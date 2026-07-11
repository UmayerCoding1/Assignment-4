import { User } from "../../generated/prisma/client";


export const registerUserService = async (payload: User) => {
    console.log(payload);
    return true
}
