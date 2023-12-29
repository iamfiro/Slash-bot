import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";
import { EmbedBuilder, TextChannel, userMention } from "discord.js";

const regex = /@/;

const event: EventListener<"interactionCreate"> = {
    type: "interactionCreate",
    async listener(bot, interaction) {
        if(!interaction.isButton()) return;
        if(!interaction.customId.startsWith('valorant-register')) return;
        const slice = interaction.customId.split('_');
        if(interaction.user.id !== slice[1]) return;

        await prisma.valorantRegister.upsert({
            create: {
                userId: slice[1],
                server: slice[2],
                valorantName: slice[3],
                valorantTag: slice[4],
            },
            update: {
                server: slice[2],
                valorantName: slice[3],
                valorantTag: slice[4],
            },
            where: {
                userId: slice[1],
            }
        });

        interaction.reply(`<@${interaction.user.id}>님 **${slice[3]}#${slice[4]}** 계정이 등록되었습니다!`)
    }
}

export default event;