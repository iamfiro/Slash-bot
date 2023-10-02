// api.henrikdev.xyz/valorant/v1/account/이름/태그?force=false
import type { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from "discord.js";
import axios from "axios";

const PingCommand: Command = {
  name: "발로란트",
  description: "발로란트 전적을 확인 합니다",
  options: {
    이름: {
      description: "이름",
      required: true,
      minLength: 0,
      maxLength: 100,
      type: "String",
    },
    태그: {
      description: "태그",
      required: true,
      minLength: 0,
      maxLength: 100,
      type: "String",
    },
  },
  async executes(bot, interaction) {
    await interaction.deferReply();
    const name = interaction.options.getString("이름") || "";
    const tag = interaction.options.getString("태그") || "";
    if (name === "")
      return await interaction.editReply("❌ 이름은 비워둘수 없습니다");
    if (tag === "")
      return await interaction.editReply("❌ 태그는 비워둘수 없습니다");
    await interaction.editReply('유저 정보를 불러오는 중입니다... 잠시만 기다려주세요')
    axios({
      method: "get",
      url: `https://api.henrikdev.xyz/valorant/v3/matches/kr/${name}/${tag}?size=1`,
    }).then(async (data: any) => {
      data = data.data;
      if (data.status !== 200) {
        return await interaction.editReply("❌ 유저를 찾을수 없습니다");
      } else {
        data = data.data[0]["players"]["all_players"];

        function selectUserJson(element: any) {
          if (element.name === name && element.tag === tag) {
            return true;
          }
        }

        const filteredData = data.filter(selectUserJson)[0]
        const stats = filteredData.stats;
        const kda = ((stats.kills + stats.assists) / stats.deaths).toFixed(2);
        const headshotPercent = Math.floor((stats.headshots / (stats.headshots + stats.bodyshots + stats.legshots)) * 100) || 0
        const embed = new EmbedBuilder()
            .setAuthor({iconURL: interaction.user.avatarURL() as string, name: interaction.user.username as string})
            .setTitle(filteredData.name as string + '#' + filteredData.tag)
            .setFields(
                {name: '레벨', value: '**' + filteredData.level.toString() + '**' + ' 레벨', inline: true},
                {name: '티어', value: filteredData.currenttier_patched, inline: true},
                {name: '헤드샷', value: headshotPercent.toString() + '%', inline: true},
                {name: 'KDA', value: kda.toString(), inline: true},
                {name: '평균 자금 소비', value: filteredData.economy.spent.average + '원', inline: true},
            )
            .setImage(filteredData.assets.card.wide)
            .setThumbnail(`https://media.valorant-api.com/playercards/${filteredData.player_card}/smallart.png`)
            .setFooter({text: filteredData.puuid})
            .setTimestamp()
        await interaction.editReply({ embeds: [embed], content: ''});
      }
    }).catch(async (e) => {
        console.log(e)
        return await interaction.editReply("❌ 유저를 찾을수 없습니다");
    })
  },
};

export default PingCommand;