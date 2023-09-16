import { EmbedBuilder } from "discord.js";
import { Command } from "octajs/dist/package/command";
import { checkAvailableUserRegister } from "../../db/user";
import { decreaseBalanceAndIncreaseMile, getMile } from "../../db/economy";

const NotEnoughMile = new EmbedBuilder()
  .setDescription(
    "상품을 사기 위한 <:economy_mile:1150026140065476668> 마일이 부족합니다"
  )
  .setColor("Red")
  .setTimestamp();

const errorOccured = (e: any) =>
  new EmbedBuilder()
    .setTitle("❌ 처리중 오류가 발생했습니다.")
    .setDescription(`\`${e}\``)
    .setTimestamp()
    .setColor("Red");

const command: Command = {
  name: "마일리지상점",
  description: "🎫 마일리지 상점에 오신것을 환영합니다 !",
  options: {
    상품: {
      type: "String",
      description: "상품",
      choices: [
        {
          name: "5,000 자금 입금 (🎫 x 1)",
          value: "5,000 자금 구매",
          name_localizations: { ko: "5,000 자금 입금 (🎫 x 1)" },
        },
      ],
      required: true,
    },
  },
  async executes(bot, interaction) {
    const nullableShopItem = interaction.options.get("상품", true).value;
    if (!nullableShopItem)
      return await interaction.reply("❌ 상품을 선택해주세요");

    await checkAvailableUserRegister(interaction);

    const buyType = nullableShopItem.toString();
    const mile = await getMile(interaction.user);

    if (mile == null)
      return await interaction.reply({ embeds: [NotEnoughMile] });

    if (buyType === "5,000 자금 구매") {
      if (mile < 1) return await interaction.reply({ embeds: [NotEnoughMile] });

      await interaction.deferReply();
      decreaseBalanceAndIncreaseMile(interaction.user, 5000, 1)
        .then(async function (result) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("✅ 구매해주셔서 감사합니다")
                .setDescription(
                  `구매 상품 : \`${buyType}\`\n사용된 마일리지 : **1** x <:economy_mile:1150026140065476668>`
                )
                .setTimestamp()
                .setColor("Green"),
            ],
          });
        })
        .catch(async function (e) {
          return await interaction.editReply({
            embeds: [errorOccured(e)],
          });
        });
    } else return await interaction.reply("❌ 상품을 찾을수 없습니다");
  },
};

export default command;
