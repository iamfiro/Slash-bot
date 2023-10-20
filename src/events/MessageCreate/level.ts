import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";
import { AttachmentBuilder, PresenceStatus } from "discord.js";
import canvacord from "canvacord";

const event: EventListener<"messageCreate"> = {
    type: "messageCreate",
    async listener(bot, message) {
        if (message.author.bot) return;
        if(process.env.NODE_ENV === 'development') return;
        await prisma.userLevel.findFirst({ where: { userId: message.author.id } }).then(async (data) => {
            if(!data) {
                await prisma.userLevel.create({ data: { userId: message.author.id, xp: 0, level: 1 } })
            } else {
                const requireXp = 50 * (Math.pow(2, data.level) - 1);

                if(data.xp + BigInt(1) >= requireXp) {
                    await prisma.userLevel.update({ where: { userId: message.author.id }, data: { xp: data.xp + BigInt(1), level: data.level + 1 } })
                    await prisma.userLevel.findFirst({ where: { userId: message.author.id } }).then(async (data) => {
                        const allLevels = (await prisma.userLevel.findMany()).sort((a, b) => {
                            if(a.level === b.level) {
                                return Number(b.xp - a.xp);
                            } else {
                                return b.level - a.level;
                            }
                        })
            
                        const currentRank = allLevels.findIndex((user) => user.userId === message.author.id) + 1;
                        const rank = new canvacord.Rank()
                            .setAvatar(message.author.avatarURL({ size: 256 }) as string)
                            .setRank(currentRank)
                            .setLevel(data?.level ?? 1)
                            .setCurrentXP(Number(data?.xp) as number)
                            .setRequiredXP(50 * (Math.pow(2, data?.level ?? 1) - 1))
                            .setStatus(message.member?.presence?.status ?? "offline" as PresenceStatus)
                            .setProgressBar("#015BFE", "COLOR")
                            .setUsername(message.author.username)
                            .setDiscriminator(message.author.discriminator)

                        const rankData = await rank.build();
                        const attachment = new AttachmentBuilder(rankData);
                        await message.channel.send({ content: `<@${message.author.id}>님 레벨 상승\n${data?.level ?? 1} -> ${data?.level ? data.level + 1 : 0}`, files: [attachment] })
                    })
                } else {
                    await prisma.userLevel.update({ where: { userId: message.author.id }, data: { xp: data.xp + BigInt(1) } })
                }
            }
        });
    }
}

export default event;