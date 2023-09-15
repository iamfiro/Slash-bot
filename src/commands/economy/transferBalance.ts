import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, codeBlock, userMention } from "discord.js";
import { onlyNumberRegex } from "../../lib/regex";
import { checkAvailableUserRegister } from "../../db/user";
import { checkTransferUser, transferMoney } from "../../db/economy";
import { numberWithCommas } from "../../lib/format";

export const TransferRegisterEmbed = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle(`🚫 Weare 봇을 한번도 사용하지 않은 유저입니다`)

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    // if(interaction.channelId === '1143111566573703258') {
        if(!onlyNumberRegex.test(interaction.options.get('금액').value.toString())) {
            const AmountMinimumErrorEmbed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle(`🚫 송금중 오류가 발생했습니다`)
            .setDescription('금액 입력이 올바르지 않습니다 금액은 숫자만 넣어주세요')
            .setTimestamp(Date.now())
            return await interaction.editReply({ embeds: [AmountMinimumErrorEmbed]})
        }
        if(Number(interaction.options.get('금액').value) < 1000) {
            const AmountMinimumErrorEmbed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle(`🚫 송금중 오류가 발생했습니다`)
            .setDescription('송금은 1000원부터 가능합니다')
            .setTimestamp(Date.now())
            return await interaction.editReply({ embeds: [AmountMinimumErrorEmbed]})
        }
        checkAvailableUserRegister(interaction).then(async data => {
            checkTransferUser(interaction.options.get('유저').value.toString()).then(async function(result) {
                if(result) return await interaction.editReply({ embeds: [TransferRegisterEmbed]});
                transferMoney(interaction, data.balance, interaction.options.get('유저').value.toString(), 
            Number(interaction.options.get('금액').value),).then(async data => {
                switch(data.status) {
                    case 'LOWER_THAN_SEND_AMOUNT':
                        const AmountErrorEmbed = new EmbedBuilder()
                        .setColor(0xED4245)
                        .setTitle(`🚫 송금중 오류가 발생했습니다`)
                        .setDescription('송금을 하기 위한 잔액이 부족합니다')
                        .setTimestamp(Date.now())
                        .addFields(
                            { name: '잔액', value: codeBlock('diff',`${numberWithCommas(Number(data.amount))}원`) },
                            { name: '송금 금액', value: codeBlock('diff',`${numberWithCommas(Number(interaction.options.get('금액').value))}원`) },
                        )
                        await interaction.editReply({ embeds: [AmountErrorEmbed]})
                        break;
                    case 'SUCCESSFULL':
                        const Embed = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`💸 송금이 완료되었습니다!`)
                        .setDescription(`**${numberWithCommas(Number(interaction.options.get('금액').value))}**원 송금됨  ✅ \n\n${userMention(interaction.member.user.id)} -> ${userMention(interaction.options.get('유저').value.toString())}`)
                        .setTimestamp(Date.now())
                        .setFooter({ text: `잔액 ${numberWithCommas(Number(data.amount))}원`})
                        await interaction.editReply({ embeds: [Embed]})
                }
            })
            })
        })
    // } else {
    //     const notThisChannel = new EmbedBuilder()
    //         .setTitle('🚫 이 기능은 <#1143111566573703258>에서 사용해주세요')
    //         .setColor('Red')
    //     await interaction.editReply({ embeds: [notThisChannel] })
    // }
}

export default {
    handler,
    info: new SlashCommandBuilder()
        .setName("송금")
        .setDescription("💸 다른 유저한테 송금할수 있어요")
        .addStringOption(option =>
            option.setName('금액')
            .setDescription('💸 금액을 입력해주세요. (1000원 이상, 수수료 10%)')
            .setNameLocalizations({
                ko: '금액'
            })
            .setDescriptionLocalizations({
                ko: '💸 금액을 입력해주세요.'
            })
            .setRequired(true)
        )
        .addUserOption(options =>
            options.setName('유저')
            .setDescription('👤 송금할 유저를 선택해주세요')
            .setDescriptionLocalizations({
                ko: '👤 레벨링을 관리할 멤버를 선택하세요.'
            })
            .setRequired(true)
        )
}