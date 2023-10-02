import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from "discord.js";

const PollCommand: Command = {
  name: "투표",
  description: "다른 사람들의 의견을 받을수 있어요!",
  options: {
    내용: {
      description: "투표의 내용입니다",
      required: true,
      minLength: 0,
      maxLength: 100,
      type: "String",
    },
  },
  async executes(_, interaction) {
    // 투표의 내용을 가져옵니다
    const topic = interaction.options.getString('내용') || '';
    // 투표 embed를 생성합니다
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setFooter({ text: `🤚 투표가 시작됨` })
      .setTimestamp()
      .setTitle("📌 투표가 시작 되었습니다")
      .setDescription(topic)
      .addFields({ name: '작성자', value: `<@${interaction.user.id}>`, inline: false });

    // 투표를 시작합니다
    const msg = await interaction.reply({ embeds: [embed] });
    // 투표 메세지를 가져옵니다
    const msgfetch = await msg.fetch();
    // 투표 메세지에 체크 및 엑스를 추가합니다
    await msgfetch.react('✅');
    await msgfetch.react('❌');
  },
};

export default PollCommand;