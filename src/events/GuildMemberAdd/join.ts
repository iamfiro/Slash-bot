import { EmbedBuilder, TextChannel } from "discord.js";
import { EventListener } from "octajs";

const eventListener: EventListener<"guildMemberAdd"> = {
  type: "guildMemberAdd",
  async listener(bot, member) {
    if(process.env.NODE_ENV === 'development') return;
    const welcomeEmbed = new EmbedBuilder()
      .setTitle("📈 입국 로그")
      .setDescription(
        `<@${member.user.id}>님 게임, 코딩, 공부등 커뮤니티 서버 \`WeAre\`에 들어오신 것을 환영합니다!`
      )
      .setThumbnail(member.user.avatarURL())
      .setTimestamp(member.joinedTimestamp);
    const message = (
      bot.channels.cache.get("1156162521833668769") as TextChannel
    ).send({ embeds: [welcomeEmbed] });
    (await message).react("<:blobcatpop:1144846825203970110>");
    const role = member.guild.roles.cache.find(
      (role) => role.id === "1131491531904254043"
    );
    if (!role) return;
    member.roles.add(role);
  },
};

export default eventListener;
