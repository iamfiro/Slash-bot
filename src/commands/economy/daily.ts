import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
import { checkAvailableUserRegister } from "../../db/user";
import { DailyBalance } from "../../db/economy";

const alreadyGetDaily = new EmbedBuilder()
  .setTitle("❌ 이미 오늘은 보상을 받으셨네요")
  .setDescription("내일 다시 시도해주세요")
  .setColor("Red");

const errorGetDaily = new EmbedBuilder()
  .setTitle("❌ 처리중 오류가 발생했습니다")
  .setDescription("잠시만 기다려주세요")
  .setColor("Red");

const PingCommand: Command = {
  name: "출석",
  description: "매일 주어지는 보상을 받으실수 있어요!",
  async executes(bot, interaction) {
    await interaction.deferReply();
    if (!interaction.member) {
        await interaction.reply("❌ 서버에서 사용해주세요");
        return;
    }

    checkAvailableUserRegister(interaction.user.id, interaction.user.username).then(async (data: any) => {
      const t = new Date();
      const today = `${t.getFullYear()}${t.getMonth()}${t.getDate()}`;
  
      if (today === data?.Economy?.lastUsedDailyCommand) {
          await interaction.editReply({ embeds: [alreadyGetDaily] });
          return;
      }

      const isMemberBooster = await interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.find((role) => role.id === "1156506697087598693");
      const isMemberDonater = await interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.find((role) => role.id === "1155126393236115601");
      
      DailyBalance(interaction.user.id, isMemberBooster|| isMemberDonater ? 20000 : 10000).then(async (data: boolean) => {
        if(data) {
          const Embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle(`✅ 출석 체크 완료`)
            .setDescription(`보상으로 ${isMemberBooster|| isMemberDonater ? '20,000' : '10,000'}원이 입금되었습니다.${isMemberBooster|| isMemberDonater ? '\nㄴ <:booster:1156511127652552745> 후원자 전용 혜택 (**출석 체크 보상 2배**)' : ''}`)
            .setTimestamp(Date.now())
          await interaction.editReply({ embeds: [Embed]})   
        } else {
          await interaction.editReply({ embeds: [errorGetDaily] });
          return;
        }
      })
    })
  },
};

export default PingCommand;