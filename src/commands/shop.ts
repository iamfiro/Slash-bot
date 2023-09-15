import { ChatInputCommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { addBalance, decreaseBalanceAndIncreaseMile, getMile } from "../db/economy";
import { checkAvailableUserRegister } from "../db/user";

const NotEnoughMile = new EmbedBuilder()
    .setDescription('상품을 사기 위한 <:economy_mile:1150026140065476668> 마일이 부족합니다')
    .setColor('Red')
    .setTimestamp()

const bugetEmoji = '<:economy_buget:1144857326264786976>';
const mileEmoji = '<:economy_mile:1150026140065476668>';
const nickChange = '<:ACNH_gemini_fragment:1152165964029370438>'

function StoreItem(itemEmoji: string, title: string, price: number, priceEmoji: string) {
    return `${itemEmoji} \`${title}\` ${priceEmoji}**${price}**`
}

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    if (!interaction.options.get('상품')) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🏦 WeAre 상점')
                    .setFields(
                        { name: '은행', value: `${StoreItem(bugetEmoji, '5,000 자금 구매', 1, mileEmoji)}\n${StoreItem('💸', '송금권', 1, mileEmoji)}`, inline: true},
                        { name: '아이템', value: `${StoreItem('🎟', '닉변권', 10, mileEmoji)}`, inline: true}
                    )
            ]
        })
    }
    checkAvailableUserRegister(interaction).then(async function () {
        const buyType = interaction.options.get('상품').value.toString();
        getMile(interaction).then(async mile => {
            if (buyType === '5,000 자금 구매') {
                if (mile < 1) return await interaction.editReply({ embeds: [NotEnoughMile] });
                decreaseBalanceAndIncreaseMile(interaction, 5000, 1).then(async function (result) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('✅ 구매해주셔서 감사합니다')
                                .setDescription(`구매 상품 : \`${buyType}\`\n사용된 마일리지 : **1** x <:economy_mile:1150026140065476668>`)
                                .setTimestamp()
                                .setColor('Green')
                        ]
                    })
                }).catch(async function (e) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('❌ 처리중 오류가 발생했습니다.')
                                .setDescription(`\`${e}\``)
                                .setTimestamp()
                                .setColor('Red')
                        ]
                    })
                });
            }
        })
    });
}

export default {
    info: new SlashCommandBuilder().setName("상점").setDescription("🎫 상점에 오신것을 환영합니다 !")
        .addStringOption(options =>
            options.setName('상품')
                .setDescription('상품')
                .addChoices(
                    { name: '5,000 자금 입금 (🎫 x 1)', value: '5,000 자금 구매', name_localizations: { ko: '5,000 자금 입금 (🎫 x 1)' } },
                )
        )
    , handler
}