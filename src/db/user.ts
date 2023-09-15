import { ChatInputCommandInteraction } from "discord.js";
import prisma from "../lib/prisma";
import { Economy, User } from "@prisma/client";

export const checkAvailableUserRegister = async (interaction: ChatInputCommandInteraction): Promise<Economy | null> => {
    const exists = await prisma.user.findFirst({ where: { userId: interaction.user.id } });
    if(exists === null) {
        const t = new Date();
        t.setHours(t.getHours() + 9)
        t.setDate(t.getDate() -1);
        const data = await prisma.user.create({
            data: {
                userId: interaction.user.id,
                userName: interaction.user.username,
                Economy: {
                    create: {
                        lastUsedDailyCommand: `${t.getFullYear()}${t.getMonth()}${t.getDate()}`,
                        dailyCommandCount: 0,
                        userName: interaction.user.username,
                    }
                }
            }
        })
    }
    const data = await prisma.economy.findFirst({where: { userId: interaction.user.id }});
    return data
}

export const getUserById = async (userId: string): Promise<Economy | null> => {
    const data = await prisma.economy.findUnique({
        where: {
            userId,
        }
    });
    return data;
}