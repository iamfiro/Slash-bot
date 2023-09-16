import type { Command } from "octajs/dist/package/command";

const PingCommand: Command = {
  name: "ping",
  description: "You say ping, I say pong!",
  async executes(bot, interaction) {
    interaction.reply("Pong!");
  },
};

export default PingCommand;
