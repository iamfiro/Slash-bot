import { ChatInputCommandInteraction } from "discord.js";
import prisma from "../lib/prisma";
import { Economy, User } from "@prisma/client";

export const dailyMoney = async (interaction: ChatInputCommandInteraction, incrementNumber: number): Promise<Economy> => {
    const data = await prisma.economy.findFirst({ where: { userId: interaction.member.user.id } });
    const t = (new Date);
    const today = `${t.getFullYear()}${t.getMonth()}${t.getDate()}`;
    return await prisma.economy.update({ where: { userId: interaction.member.user.id }, data: {
        balance: Number(data.balance) + incrementNumber,
        lastUsedDailyCommand: today,
        dailyCommandCount: {
            increment: 1
        },
        mile: {
            increment: 10
        }
    }}).then(async (data) => {
        return data
    })
}

export const getBalance = async (interaction: ChatInputCommandInteraction): Promise<bigint> => {
    const data = await prisma.economy.findFirst({
        where: {
            userId: interaction.user.id,
        }
    });
    return data.balance
}

export const transferMoney = async (interaction: ChatInputCommandInteraction, userBalance: bigint, toUser: string, amount: number): Promise<{ status: string, amount: bigint}> => {
    if (BigInt(userBalance) < amount) return { status: 'LOWER_THAN_SEND_AMOUNT', amount: userBalance};
    const decreaseUserMoney = await prisma.economy.update({ where: { userId: interaction.member.user.id }, data: { balance: {
        decrement: BigInt(amount)
    }}});
    const increaseToUserMoney = await prisma.economy.update({ where: { userId: toUser }, data: { balance: {
        increment: BigInt(amount)
    }}});
    return { status: 'SUCCESSFULL', amount: decreaseUserMoney.balance}
}

export const checkTransferUser = async (userid: string): Promise<boolean> => {
    const exists = await prisma.user.findFirst({ where: { userId: userid } });
    if (exists) return false;
    return true
}

export const getMile = async (interaction: ChatInputCommandInteraction): Promise<number> => {
    const data = await prisma.economy.findFirst({
        where: {
            userId: interaction.user.id,
        }
    });
    return data.mile
}

export const addBalance = async (interaction: ChatInputCommandInteraction, value: number): Promise<Economy> => {
    return await prisma.economy.update({ where: { userId: interaction.user.id }, data: { balance: {
        increment: value
    }}});
}

export const decreaseBalanceAndIncreaseMile = async (interaction: ChatInputCommandInteraction, value: number, mile: number): Promise<Economy> => {
    await prisma.economy.update({ where: { userId: interaction.user.id }, data: { mile: {
        decrement: mile
    }}});
    return await prisma.economy.update({ where: { userId: interaction.user.id }, data: { balance: {
        increment: value
    }}});
}