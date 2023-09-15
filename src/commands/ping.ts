import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "../lib/bot";

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const reply = await interaction.fetchReply()
    const ping = reply.createdTimestamp - interaction.createdTimestamp

    await interaction.editReply({ embeds: [
        new EmbedBuilder()
        .setTitle('🏓 퐁!')
        .addFields(
            { name: '⏱ 봇 지연', value: `**${ping}**ms` },
            { name: '⏱ API 지연', value: `**${interaction.client.ws.ping}**ms` }
        )
        .setTimestamp()
    ]})
}

export default {
    info: new SlashCommandBuilder().setName("ping").setDescription("🏓 봇의 핑을 확인합니다!"),
    handler
}