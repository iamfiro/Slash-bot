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
    if(interaction.user.id !== '535676248513314816') return await interaction.reply({ content: '❌ 권한이 없습니다', ephemeral: true})
    await interaction.reply({ content: '✅ 알림 전송됨', ephemeral: true})
    const version = interaction.options.getString('version') || '';
    (bot.channels.cache.get("1156160717087572008") as TextChannel).send(`✅ 봇이 업데이트 되었습니다 - **${version}**\n자세한 패치노트는 <id:customize>에서 \`츠니봇 알림 받기\`를 눌러주세요`);
  },
};

export default command;
