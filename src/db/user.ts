import prisma from "../lib/prisma";
import { User } from "@prisma/client";
import { APIResponse, APIResponseType } from "../types/db";
import { getYesterdayDate } from "../lib/date";

// Check if user is already registered
export const checkAvailableUser = async (
    userId: string,
): Promise<APIResponse> => {
    // Check if user is already registered
    const exists = await prisma.user.findFirst({
        where: { userId },
        include: {
            Economy: true
        }
    });
    if (!exists) {
        return { status: APIResponseType.USER_NOT_REGISTERED }
    }
    return { status: APIResponseType.USER_ALREADY_REGISTERED }
};

export const registerUser = async (
    userId: string,
    userName: string,
): Promise<APIResponse> => {
    const t = getYesterdayDate();
    return await prisma.user.create({
        data: {
            userId,
            userName,
            Economy: {
                create: {
                    userName,
                    lastUsedDailyCommand: `${t.getFullYear()}${t.getMonth()}${t.getDate()}`,
                }
            }
        },
    }).then((user: User) => {
        return { status: APIResponseType.USER_REGISTERED, data: user };
    }).catch((err: any) => {
        console.error(err)
        return { status: APIResponseType.USER_REGISTERED_FAILED, data: err };
    })
}

// Get user data from ID
export const getUserById = async (userId: string): Promise<APIResponse> => {
    const data = await prisma.user.findUnique({
        where: {
            userId,
        },
        include: {
            Economy: true
        }
    });
    return { status: APIResponseType.DATA_FOUND, data };
};
