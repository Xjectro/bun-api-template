import { User, UserType } from "../database/models/users";
import { v4 as uuidV4 } from "uuid";

export class DbService {
    constructor() { }

    public create = {
        user: async (
            userData: Partial<
                Pick<UserType, "firstName" | "lastName" | "email" | "password">
            >
        ): Promise<any> => {
            return await User.create({
                userId: uuidV4(),
                ...userData,
                avatarURL: `https://ui-avatars.com/api/?size=128&bold=true&uppercase=true&background=ffffff&color=000000&name=${encodeURIComponent(
                    [userData.firstName, userData.lastName].filter(Boolean).join(" ")
                )}`,
                role: "USER",
            });
        },
    };
}
