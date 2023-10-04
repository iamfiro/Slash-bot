import { getTodayStringDate } from "../lib/date";
import prisma from "../lib/prisma";
import { APIResponse, APIResponseType } from "../types/db";

export const DailyBalance = async (userId: string, amount: number): Promise<APIResponse> => {
    const date = new Date()
    return await prisma.user.update({ 
        where: { 
            userId 
        }, data: { 
            Economy: {
                update: {
                    lastUsedDailyCommand: getTodayStringDate(),
                    balance: {
                        increment: amount
                    }
                }
            }
        } 
    }).then(() => {
        return { status: APIResponseType.DATA_UPDATED }
    }).catch((e) => {
        return { status: APIResponseType.DATA_NOT_UPDATED }
    });
}

export const IncreseBalance = async (userId: string, amount: number): Promise<APIResponse> => {
    return await prisma.user.update({ 
        where: { 
            userId 
        }, data: { 
            Economy: {
                update: {
                    balance: {
                        increment: amount
                    }
                }
            }
        } 
    }).then(() => {
        return { status: APIResponseType.DATA_UPDATED }
    }).catch((e) => {
        return { status: APIResponseType.DATA_NOT_UPDATED }
    });
}

export const DecreseBalance = async (userId: string, amount: number): Promise<APIResponse> => {
    return await prisma.user.update({ 
        where: { 
            userId 
        }, data: { 
            Economy: {
                update: {
                    balance: {
                        decrement: amount
                    }
                }
            }
        } 
    }).then(() => {
        return { status: APIResponseType.DATA_UPDATED }
    }).catch((e) => {
        return { status: APIResponseType.DATA_NOT_UPDATED }
    });
}