import prisma from "../lib/prisma";
import { APIResponse, APIResponseType } from "../types/db";

export const RockPaperScissorMoney = async (winUserId: string, loseUserId: string, transferBalance: number): Promise<APIResponse> => {
    try {
        await prisma.economy.update({
            where: {
                userId: loseUserId,
            }, 
            data: {
                balance: {
                    decrement: BigInt(transferBalance)
                }
            }
        })
    
        await prisma.economy.update({
            where: {
                userId: winUserId
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