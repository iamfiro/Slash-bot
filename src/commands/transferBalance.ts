import { EmbedBuilder, GuildMember, codeBlock, userMention } from "discord.js";
import { Command } from "octajs/dist/package/command";
import { onlyNumberRegex } from "../lib/regex";
import { checkAvailableUserRegister } from "../db/user";
import { checkTransferUser, transferMoney } from "../db/economy";
import { numberWithCommas } from "../lib/format";

export const TransferRegisterEmbed = new EmbedBuilder()
  .setColor(0xed4245)
  .setTitle(`🚫 Weare 봇을 한번도 사용하지 않은 유저입니다`);

const command: Command = {
  name: "송금",
  description: "💸 다른 유저한테 송금할수 있어요",
  options: {
    금액: {
      type: "Integer",
      description: "💸 금액을 입력해주세요. (1000원 이상, 수수료 10%)",
      required: true,
    },
    유저: {
      type: "User",
      description: "👤 송금할 유저를 선택해주세요",
      required: true,
    },
  },
  async executes(bot, interaction) {
    if (!interaction.member)
      return await interaction.reply("❌ 서버에서 사용해주세요");
    await interaction.deferReply();

    const nullableOption = interaction.options.get("금액", true).value;
    if (!nullableOption)
      return await interaction.editReply("❌ 금액을 입력해주세요");
    const money = nullableOption;

    const nullableUserOption = interaction.options.get("유저", true).value;
    if (!nullableUserOption)
      return await interaction.editReply("❌ 유저를 입력해주세요");

    if (!onlyNumberRegex.test(nullableOption.toString())) {
      const AmountMinimumErrorEmbed = new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle(`🚫 송금중 오류가 발생했습니다`)
        .setDescription(
          "금액 입력이 올바르지 않습니다 금액은 숫자만 넣어주세요"
        )
        .setTimestamp(Date.now());
      return await interaction.editReply({ embeds: [AmountMinimumErrorEmbed] });
    }

    if (Number(money) < 1000) {
      const AmountMinimumErrorEmbed = new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle(`🚫 송금중 오류가 발생했습니다`)
        .setDescription("송금은 1000원부터 가능합니다")
        .setTimestamp(Date.now());
      return await interaction.editReply({ embeds: [AmountMinimumErrorEmbed] });
    }

    const data = await checkAvailableUserRegister(interaction);
    if (!data) return await interaction.editReply("❌ 유저를 찾을수 없습니다");

    const result = await checkTransferUser(nullableUserOption.toString());
    if (result)
      return await interaction.editReply({
        embeds: [TransferRegisterEmbed],
      });

    const transfered = await transferMoney(
      interaction.member as GuildMember,
      data.balance,
      nullableUserOption.toString(),
      Number(money)
    );

    switch (transfered.status) {
      case "LOWER_THAN_SEND_AMOUNT":
        const AmountErrorEmbed = new EmbedBuilder()
          .setColor(0xed4245)
          .setTitle(`🚫 송금중 오류가 발생했습니다`)
          .setDescription("송금을 하기 위한 잔액이 부족합니다")
          .setTimestamp(Date.now())
          .addFields(
            {
              name: "잔액",
              value: codeBlock(
                "diff",
                `${numberWithCommas(Number(transfered.amount))}원`
              ),
            },
            {
              name: "송금 금액",
              value: codeBlock("diff", `${numberWithCommas(Number(money))}원`),
            }
          );
        await interaction.editReply({ embeds: [AmountErrorEmbed] });
        break;
      case "SUCCESSFULL":
        const Embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle(`💸 송금이 완료되었습니다!`)
          .setDescription(
            `**${numberWithCommas(
              Number(money)
            )}**원 송금됨  ✅ \n\n${userMention(
              interaction.member.user.id
            )} -> ${userMention(nullableUserOption.toString())}`
          )
          .setTimestamp(Date.now())
          .setFooter({
            text: `잔액 ${numberWithCommas(Number(transfered.amount))}원`,
          });
        await interaction.editReply({ embeds: [Embed] });
    }
  },
};

export default command;
