import { User, UserType } from "../database/models/users";

/**
 * Database service class for handling user-related operations.
 */
export class DbService {
    constructor() { }

    public create = {
        user: async (
            userData: Partial<
                Pick<UserType, "firstName" | "lastName" | "email" | "password">
            >
        ): Promise<any> => {
            return await User.create({
                ...userData,
                avatarURL: `https://ui-avatars.com/api/?size=128&bold=true&uppercase=true&background=ffffff&color=000000&name=${encodeURIComponent(
                    [userData.firstName, userData.lastName].filter(Boolean).join(" ")
                )}`,
                role: "USER",
            });
        },
    };
}
