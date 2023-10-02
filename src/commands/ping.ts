import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'

const PingCommand: Command = {
  name: "ping",
  description: "You say ping, I say pong!",
  async executes(_, interaction) {
    // Defer the reply to avoid the client from thinking the interaction has timed out.
    await interaction.deferReply();

    // Fetch the reply to measure the API latency.
    const reply = await interaction.fetchReply();

    // Get the timestamps of the reply and the interaction.
    const { createdTimestamp: replyTimestamp } = reply;
    const { createdTimestamp: interactionTimestamp } = interaction;

    // Calculate the latency by subtracting the reply's timestamp from the interaction's timestamp.
    const ping = replyTimestamp - interactionTimestamp;

    // Edit the interaction's reply with the ping.
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