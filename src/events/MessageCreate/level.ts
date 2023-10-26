import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";
import { AttachmentBuilder, PresenceStatus } from "discord.js";
import canvacord from "canvacord";

const event: EventListener<"messageCreate"> = {
    type: "messageCreate",
    async listener(bot, message) {
        if (message.author.bot) return;
        if(message.channelId === '1156169791824990268') return;
        if(message.channelId === '1156161297600233512') return;
        if(process.env.NODE_ENV === 'development') return;
        await prisma.userLevel.findFirst({ where: { userId: message.author.id } }).then(async (data) => {
            if(!data) {
                await prisma.userLevel.create({ data: { userId: message.author.id, xp: 0, level: 0 } })
            } else {
                const requireXp = (data.level + 1) * 100

                if(data.xp + BigInt(1) >= requireXp) {
                    const newData = await prisma.userLevel.update({ where: { userId: message.author.id }, data: { xp: data.xp + BigInt(1), level: data.level + 1 } })
                    await prisma.userLevel.findFirst({ where: { userId: message.author.id } }).then(async (data) => {
                        (await prisma.userLevel.findMany()).sort((a, b) => {
                            if(a.level === b.level) {
                                return Number(b.xp - a.xp);
                            } else {
                                return b.level - a.level;
                            }
                        })
            
                        await message.channel.send({ content: `<@${message.author.id}>, **${(newData?.level as number) - 1 ?? 1}** 레벨 -> **${newData?.level}** 레벨 👑` })
                    })
                } else {
                    await prisma.userLevel.update({ where: { userId: message.author.id }, data: { xp: data.xp + BigInt(1) } })
                }
            }
        });
    }
}

export default event;