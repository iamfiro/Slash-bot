import { Command } from "octajs/dist/package/command";
import { checkAvailableUserRegister, getUserById } from "../db/user";
import { EmbedBuilder } from "discord.js";
import { numberWithCommas } from "../lib/format";

const command: Command = {
  name: "프로필",
  description: "내 정보를 확인합니다",
  options: {
    유저: {
      description: "👤 표시할 유저를 선택해주세요",
      required: true,
      type: "User",
    },
  },
  async executes(bot, interaction) {
    if (!interaction.guild)
      return await interaction.reply("❌ 서버에서 사용해주세요");
    const datas = await checkAvailableUserRegister(interaction);

    const nullableUser = interaction.options.get("유저", true);
    if (!nullableUser || !nullableUser.value)
      return await interaction.reply("❌ 유저를 찾을수 없습니다");

    const user = nullableUser.value.toString();
    const data = await getUserById(user);
    if (!data) return await interaction.reply("❌ 유저를 찾을수 없습니다");

    const members = await interaction.guild.members.fetch(user);
    if (!members) return await interaction.reply("❌ 유저를 찾을수 없습니다");
    if (members.joinedTimestamp == null)
      return await interaction.reply("❌ 유저가 찾을수 없습니다");
    const d = new Date(members.joinedTimestamp);

    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setThumbnail(members.user.avatarURL())
          .setTitle(`${members.user.displayName}님의 정보`)
          .addFields(
            {
              name: "서버 참가일",
              value: `${d.getFullYear()}년 ${d.getMonth()}월 ${d.getDay()}일 ${d.getHours()}시 ${d.getMinutes()}분 ${d.getMinutes()}초`,
            },
            {
              name: "은행 💎",
              value: `<:economy_buget:1144857326264786976> x **${numberWithCommas(
                data.balance
              )}**원\n<:economy_mile:1150026140065476668> x **${numberWithCommas(
                data.mile
              )}**개`,
              inline: true,
            },
            { name: " ", value: " " },
            {
              name: "도박 통계 🎰",
              value: `<:economy_buget:1144857326264786976> 사용한 자금 : **${numberWithCommas(
                data.betWinValue + data.betFailedValue
              )}**원\n💵 성공 x **${numberWithCommas(
                data.betWin
              )}** <:economy_buget:1144857326264786976> 얻은자금 : **${numberWithCommas(
                data.betWinValue
              )}**원\n💸 실패 x **${numberWithCommas(
                data.betFailed
              )}** <:economy_buget:1144857326264786976> 잃은 자금 : **${numberWithCommas(
                data.betFailedValue
              )}**원\n\n✅ 성공 확률 : **${Math.floor(
                (data.betWin / (data.betFailed + data.betWin)) * 100
              )}**%`,
              inline: true,
            }
          )
          .setTimestamp(),
      ],
    });
  },
};

export default command;
