import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";
import { TextChannel, userMention } from "discord.js";

const event: EventListener<"messageCreate"> = {
    type: "messageCreate",
    async listener(bot, message) {
        if (message.author.bot) return;
        const server = (
            bot.channels.cache.get("1209827288846303252") as TextChannel
        ).send({ content: `채팅이 감지됨 | ${userMention(message.author.id)} <${message.author.id}> - \`${message.content}\` | ${new Date().toTimeString()} / ${new Date().toDateString()}`})
        if(!message.guild) return;
        if(process.env.NODE_ENV === 'development') return;

        await prisma.userLevel.findFirst({ where: { userId: message.author.id } }).then(async (data) => {
            if(!data) {
                await prisma.userLevel.create({ data: { userId: message.author.id, xp: 0, level: 0 } })
            } else {
                const requireXp = (data.level + 1) * 100

                if(data.xp + BigInt(1) >= requireXp) {
                    const newData = await prisma.userLevel.update({ where: { userId: message.author.id }, data: { xp: { increment: BigInt(1) }, level: data.level + 1 } })
                    await prisma.userLevel.findFirst({ where: { userId: message.author.id } }).then(async (data) => {
                        (await prisma.userLevel.findMany()).sort((a, b) => {
                            if(a.level === b.level) {
                                return Number(b.xp - a.xp);
                            } else {
                                return b.level - a.level;
                            }
                        })
                        
                        const server = (
                            bot.channels.cache.get("1209800107965419620") as TextChannel
                        ).send({ content: `<@${message.author.id}>, **${(newData?.level as number) - 1 ?? 1}** 레벨 -> **${newData?.level}** 레벨 👑` })
                    })
                } else {
                    await prisma.userLevel.update({ where: { userId: message.author.id }, data: { xp: { increment: BigInt(1) } } })
                }
            }
        });
    }
}

export default event;
