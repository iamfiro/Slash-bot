import { Command } from "octajs/dist/package/command";
import { AttachmentBuilder, Embed, EmbedBuilder, PresenceStatus } from 'discord.js';
import prisma from "../../lib/prisma";
import canvacord from "canvacord";

const command: Command = {
    name: "랭킹",
    description: "[ 🏆 ] 서버 랭킹을 보여줍니다",
    async executes(_, interaction) {
        await interaction.deferReply();
        const user = await prisma.userLevel.findMany({
            orderBy: [
                {
                    xp: 'desc',
                }
            ],
        });

        const me = user.find((user) => user.userId === interaction.user.id);
        const currentXp = me?.level === 0 ? Number(me.xp) : Number(me?.xp) - Number(me?.level) * 100
        const fetchedMe = interaction.guild?.members.cache.get(interaction.user.id);
        const currentRank = user.findIndex((user) => user.userId === interaction.user.id) + 1;
        const rank = new canvacord.Rank()
            .setAvatar(interaction.user.avatarURL({ size: 256 }) as string)
            .setRank(currentRank)
            .setLevel(me?.level ?? 1)
            .setCurrentXP(currentXp)
            .setRequiredXP(100)
            .setStatus(fetchedMe?.presence?.status ?? "offline" as PresenceStatus)
            .setProgressBar("#015BFE", "COLOR")
            .setUsername(fetchedMe?.user.username as string)
            .setDiscriminator(fetchedMe?.user.discriminator as string)

        const rankData = await rank.build();
        const attachment = new AttachmentBuilder(rankData);
        const sliceUser = user.slice(0, 10);
        let text: string = '';

        sliceUser.map((user, index) => {
            const fetched = interaction.guild?.members.cache.get(user.userId);
            text += `${index + 1}위: ${fetched?.user.username} | XP: ${user.xp} | 레벨: ${user.level} \n`

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('🏆 랭킹')
                .setDescription(`\`\`\`${text}\`\`\``)
                .setTimestamp()
            index + 1 === sliceUser.length ? interaction.editReply({ embeds: [embed], files: [attachment] }) : interaction.editReply({ embeds: [embed] })
        })
    },
};

export default command;