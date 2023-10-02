import prisma from "../lib/prisma";

export const DailyBalance = async (userId: string, amount: number): Promise<boolean> => {
    const date = new Date()
    return await prisma.user.update({ 
        where: { 
            userId 
        }, data: { 
            Economy: {
                update: {
                    lastUsedDailyCommand: `${date.getFullYear()}${date.getMonth()}${date.getDate()}`,
                    balance: {
                        increment: amount
                    }
                }
            }
        } 
    }).then(() => {
        return true
    }).catch((e) => {
        return false
    });
}

export const IncreseBalance = async (userId: string, amount: number): Promise<boolean> => {
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
        return true
    }).catch((e) => {
        return false
    });
}

export const DecreseBalance = async (userId: string, amount: number): Promise<boolean> => {
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
        return true
    }).catch((e) => {
        return false
    });
}