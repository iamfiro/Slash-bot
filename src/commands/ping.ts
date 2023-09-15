import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Pongs!")
}

export default {
    info: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    handler
}