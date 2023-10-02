import type { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from "discord.js";
import axios from "axios";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const PingCommand: Command = {
  name: "발로란트",
  description: "발로란트 전적을 확인 합니다",
  options: {
    기능: {
      description: "기능",
      required: true,
      type: "String",
      choices: [
        {
          name: "경쟁전 전적",
          value: "경쟁전 전적",
        },
        {
          name: "일반전 전적 (티어 표시 x)",
          value: "일반전 전적",
        },
      ],
    },
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
    const choice = interaction.options.getString('기능') || '일반전 전적'
    const name = interaction.options.getString('이름') || ''
    const tag = interaction.options.getString('태그') || ''
    logger.info(`Valorant statistics : Choice: ${choice}, Name: ${name}, Tag: ${tag}`);
    if (!name || !tag) {
      return await interaction.editReply("❌ 이름과 태그는 비워둘수 없습니다");
    }
    await interaction.editReply(
      "유저 정보를 불러오는 중입니다... 잠시만 기다려주세요"
    );
    try {
      const { data } = await axios.get(
        `https://api.henrikdev.xyz/valorant/v3/matches/kr/${name}/${tag}?mode=${
          choice === "경쟁전 전적" ? "competitive" : "unrated"
        }&size=1`
      );
      const { status, data: matchData } = data;
      if (status !== 200) {
        return await interaction.editReply("❌ 유저를 찾을수 없습니다");
      }
      const { all_players: players } = matchData[0].players;
      const filteredData = players.find(
        (player: { name: string; tag: string; }) => player.name === name && player.tag === tag
      );
      if (!filteredData) {
        return await interaction.editReply("❌ 유저를 찾을수 없습니다");
      }
      const { stats, assets, economy, player_card, puuid } = filteredData;
      const kda = ((stats.kills + stats.assists) / stats.deaths).toFixed(2);
      const headshotPercent =
        Math.floor(
          (stats.headshots /
            (stats.headshots + stats.bodyshots + stats.legshots)) *
            100
        ) || 0;

      const valorantFields =  [
        { name: "레벨", value: "**" + filteredData.level + "**" + " 레벨", inline: true },
        { name: "헤드샷", value: headshotPercent + "%", inline: true },
        { name: "KDA", value: kda.toString(), inline: true },
        { name: "평균 자금 소비", value: economy.spent.average + "원", inline: true }
      ]
      const valorantCompetitiveFields =  [
        { name: "레벨", value: "**" + filteredData.level + "**" + " 레벨", inline: true },
        { name: "티어", value: filteredData.currenttier_patched, inline: true },
        { name: "헤드샷", value: headshotPercent + "%", inline: true },
        { name: "KDA", value: kda.toString(), inline: true },
        { name: "평균 자금 소비", value: economy.spent.average + "원", inline: true }
      ]
      const embed = new EmbedBuilder()
        .setAuthor({
          iconURL: interaction.user.avatarURL() as string,
          name: interaction.user.username as string,
        })
        .setTitle(filteredData.name as string + "#" + filteredData.tag)
        .setFields(choice === "경쟁전 전적" ? valorantCompetitiveFields : valorantFields)
        .setImage(assets.card.wide)
        .setThumbnail(
          `https://media.valorant-api.com/playercards/${player_card}/smallart.png`
        )
        .setFooter({ text: puuid })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed], content: "" });
    } catch (error) {
      logger.error(error);
      await interaction.editReply("❌ 유저를 찾을수 없습니다");
    }
  },
};

export default PingCommand;