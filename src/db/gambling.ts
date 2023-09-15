import { ChatInputCommandInteraction } from "discord.js"
import { getBalance } from "./economy"
import prisma from "../lib/prisma"

export const betMoney = async (interaction: ChatInputCommandInteraction, scale: number, money: number): Promise<{ amount: number, updateBalance: bigint }> => {
    money = Number(money)
    return getBalance(interaction).then(async result => {
        return await prisma.economy.update({
            where: {
                userId: interaction.member.user.id.toString()
            },
            data: {
                betWin: {
                    increment: scale !== 0 ? 1: 0
                },
                betFailed: {
                    increment: scale === 0 ? 1: 0
                },
                betFailedValue: {
                    increment: scale === 0 ? money: 0
                },
                betWinValue: {
                    increment: scale !== 0 ? money: 0
                },
                balance: BigInt(scale === 0 ? result - BigInt(money) : BigInt(result) - BigInt(money) + BigInt(money * scale))
            }
        }).then(async (response) => {
            return {amount: (money * scale), updateBalance: response.balance}
        })
    })
}