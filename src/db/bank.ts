import prisma from "../lib/prisma";
import { APIResponse, APIResponseType } from "../types/db";

export const transferMoney = async (userId: string, recipientId: string, principalBalance: number, transferBalance: number): Promise<APIResponse> => {
    try {
        await prisma.economy.update({
            where: {
                userId
            }, 
            data: {
                balance: {
                    decrement: BigInt(principalBalance)
                }
            }
        })
    
        await prisma.economy.update({
            where: {
                userId: recipientId
            },
            data: {
                balance: {
                    increment: BigInt(transferBalance)
                }
            }
        })
        
        return { status: APIResponseType.DATA_UPDATED }
    } catch(e) {
        console.log(e)
        return { status: APIResponseType.DATA_NOT_UPDATED }
    }
}