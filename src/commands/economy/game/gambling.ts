import { Command } from "octajs/dist/package/command";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, codeBlock, userMention } from 'discord.js'
import { onlyNumberRegex } from "../../../lib/regex";
import { checkAvailableUser } from "../../../db/user";
import { APIResponseType } from "../../../types/db";
import { EmbedBotError, EmbedNotRegister, isHaveDonatorRole } from "../../../lib/discord";
import { DecreseBalance, IncreseBalance, getUserBalance } from "../../../db/economy";
import { transferMoney } from "../../../db/bank";
import { numberWithCommas } from "../../../lib/format";

function caculateFee(amount: number, isDonater: boolean) {
    if(isDonater) return amount;
    return Math.floor(amount - (amount * 0.1));
}

const PingCommand: Command = {
    name: "도박",
    description: "[ 💸 ] 잃을지 얻을지...",
    options: {
        베팅금액: {
            description: "💸 금액을 입력해주세요. (1000원 이상, 최대 수수료 10%)",
            required: true,
            type: "Integer",
        },
    },
    async executes(bot, interaction) {
        await interaction.deferReply();
        const BettingMoney = interaction.options.getInteger("베팅금액") as number;
        if(!onlyNumberRegex.test(BettingMoney.toString() || "")) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle("❌ 베팅 금액은 숫자만 입력 가능합니다.")
                .setColor('Red')
                .setTimestamp()
            ]
        })
        if(BettingMoney < 1000) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle("❌ 최소 송금 금액은 1,000원입니다.")
                .setColor('Red')
                .setTimestamp()
            ]
        });

        const isRegister = checkAvailableUser(interaction.user.id)
        if ((await isRegister).status === APIResponseType.USER_NOT_REGISTERED) return await interaction.editReply({ embeds: [EmbedNotRegister] });

        await interaction.editReply("😯 두구두구두구...");
        
        const userBalance = getUserBalance(interaction.user.id);

        const random = Math.floor(Math.random() * (2 - 1 + 1) + 1);

        if(BettingMoney > ((await userBalance).data.balance as number)) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle("❌ 베팅 금액이 보유 금액보다 많습니다.")
                .setColor('Red')
                .setTimestamp()
            ], content: ''
        });

        // discord.js button
        const row = new ActionRowBuilder<ButtonBuilder>();

        random === 1 ? (
            row.components.push(
                new ButtonBuilder().setCustomId('dummy').setLabel(`${numberWithCommas((await userBalance).data.balance)} -> ${numberWithCommas(((await userBalance).data.balance) + BigInt(BettingMoney))}`).setStyle(ButtonStyle.Success).setEmoji({ id: '1170019126014648422' }).setDisabled(true)
            )
        ) : (
            row.components.push(
                new ButtonBuilder().setCustomId('dummy').setLabel(`${numberWithCommas((await userBalance).data.balance)} -> ${numberWithCommas(((await userBalance).data.balance) - BigInt(BettingMoney))}`).setStyle(ButtonStyle.Danger).setEmoji({ id: '1170019126014648422' }).setDisabled(true)
            )
        )


        if(random === 1) {
            const res = IncreseBalance(interaction.user.id, BettingMoney);

            if((await res).status === APIResponseType.DATA_UPDATED) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("🎉 축하합니다!")
                            .setDescription(`<:economy_buget:1170019126014648422> \`${numberWithCommas(BettingMoney)}원\`을 얻으셨습니다!`)
                            .setColor('Green')
                            .setTimestamp()
                    ], content: '', components: [row]
                });
            } else {
                return await interaction.editReply({ embeds: [EmbedBotError], content: '' });
            }
        } else {
            const res = DecreseBalance(interaction.user.id, BettingMoney);

            if((await res).status === APIResponseType.DATA_UPDATED) {
                return await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("😥 아쉽네요!")
                            .setDescription(`<:economy_buget:1170019126014648422> \`${numberWithCommas(BettingMoney)}원\`을 잃으셨습니다!`)
                            .setColor('Red')
                            .setTimestamp()
                    ], content: '', components: [row]
                });
            } else {
                return await interaction.editReply({ embeds: [EmbedBotError], content: '' });
            }
        }
    },
};


export default PingCommand;