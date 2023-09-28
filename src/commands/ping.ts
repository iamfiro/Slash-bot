import type { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
const PingCommand: Command = {
  name: "ping",
  description: "You say ping, I say pong!",
  async executes(bot, interaction) {
    await interaction.deferReply();
    const reply = await interaction.fetchReply()
    const ping = reply.createdTimestamp - interaction.createdTimestamp

    await interaction.editReply({ embeds: [
        new EmbedBuilder()
        .setTitle('🏓 퐁!')
        .addFields(
            { name: '⏱ 봇 지연', value: `\`\`\`${ping}ms\`\`\``, inline: true},
            { name: '⏱ API 지연', value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true}
        )
        .setTimestamp()
    ]})
  },
};

export default PingCommand;
