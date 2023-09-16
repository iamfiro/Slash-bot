import { GuildMember, TextChannel } from "discord.js";
import { Command } from "octajs/dist/package/command";

const command: Command = {
  name: "청소",
  description: "채팅을 청소합니다",
  options: {
    개수: {
      type: "Integer",
      description: "청소할 메세지 개수를 입력해주세요 (기본값 100개)",
      required: false,
    },
  },
  async executes(bot, interaction) {
    if (!interaction.channel)
      return await interaction.reply("❌ 서버에서 사용해주세요");
    if (!interaction.member)
      return await interaction.reply("❌ 서버에서 사용해주세요");
    if (!interaction.guild)
      return await interaction.reply("❌ 서버에서 사용해주세요");

    const gmember = interaction.member as any as GuildMember;

    if (
      !gmember.permissions.has("Administrator") &&
      !gmember.permissions.has("ManageMessages")
    )
      return await interaction.reply("❌ 권한이 없습니다");

    const nullableOption = interaction.options.get("개수", false)?.value || 100;
    // remove message
    if (interaction.channel.isTextBased())
      await (interaction.channel as any as TextChannel).bulkDelete(
        Number(nullableOption)
      );

    return await interaction.reply({
      content: `✅ ${nullableOption}개의 메세지를 삭제했습니다`,
      ephemeral: true,
    });
  },
};

export default command;
