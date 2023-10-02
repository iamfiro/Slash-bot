import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'

const PingCommand: Command = {
  name: "ping",
  description: "You say ping, I say pong!",
  async executes(_, interaction) {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    const { createdTimestamp: replyTimestamp } = reply;
    const { createdTimestamp: interactionTimestamp } = interaction;
    const ping = replyTimestamp - interactionTimestamp;

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('🏓 퐁!')
          .addFields(
            { name: '⏱ 봇 지연', value: `\`\`\`${ping}ms\`\`\``, inline: true },
            { name: '⏱ API 지연', value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``, inline: true }
          )
          .setTimestamp()
      ]
    });
  },
};

export default PingCommand;