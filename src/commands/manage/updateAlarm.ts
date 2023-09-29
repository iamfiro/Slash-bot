import { GuildMember, TextChannel } from "discord.js";
import { Command } from "octajs/dist/package/command";

const command: Command = {
  name: "업데이트알림",
  description: "[ 🔒 ] 업데이트 알림을 채널에 보냅니다.",
  options: {
    version: {
        type: "String",
        description: "버전 이름",
        required: true
    },
  },
  async executes(bot, interaction) {
    await interaction.reply({ content: '✅ 알림 전송됨', ephemeral: true})
    const version = interaction.options.getString('version') || '';
    (bot.channels.cache.get("1156831434934337616") as TextChannel).send(`✅ 봇이 업데이트 되었습니다 - **${version}**\n자세한 패치노트는 <id:customize>에서 \`츠니봇 알림 받기\`를 눌러주세요`);
  },
};

export default command;
