import { GuildMember, TextChannel } from "discord.js";
import { Command } from "octajs/dist/package/command";

const command: Command = {
  name: "타임아웃",
  description: "[ 🔒 ] 사용자를 타임아웃합니다",
  options: {
    유저: {
        type: "User",
        description: "타임아웃할 유저",
        required: true
    },
    시간: {
        type: "Integer",
        description: "타임아웃 시간 (기본 5분)",
        required: false
    }
  },
  async executes(bot, interaction) {
    if (!interaction.channel) return await interaction.reply("❌ 서버에서 사용해주세요");
    if (!interaction.member) return await interaction.reply("❌ 서버에서 사용해주세요");
    if (!interaction.guild) return await interaction.reply("❌ 서버에서 사용해주세요");
    const usr = interaction.options.getUser("유저", true);
    const member = interaction.guild.members.cache.get(usr.id);
    if (!member) return await interaction.reply("❌ 서버에서 사용해주세요");
    
    const gmember = interaction.member as any as GuildMember;
    // 유저 입력 or 5분
    const timeoutSeconds = interaction.options.getInteger("시간", false) || 60 * 5;

    // 관리자, 밴, 킥중 하나라도 권한이 있어야 실행 가능 
    if (
      !gmember.permissions.has("Administrator") &&
      !gmember.permissions.has("KickMembers") &&
      !gmember.permissions.has("BanMembers")
    )
      return await interaction.reply("❌ 권한이 없습니다");

    try {
        await member.timeout(timeoutSeconds);
        await interaction.reply(`✅ ${member.user.tag}님을 ${timeoutSeconds}초 동안 타임아웃 했습니다`);
    } catch(e) {
        // 봇보다 권한이 높은 유저룰 타임아웃 하려고 시도함
        await interaction.reply("❌ 권한이 없습니다");
    }
  },
};

export default command;
