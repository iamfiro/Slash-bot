import { Command } from "octajs/dist/package/command";
import { EmbedBuilder, codeBlock, userMention } from 'discord.js'
import { onlyNumberRegex } from "../../../lib/regex";
import { checkAvailableUser } from "../../../db/user";
import { APIResponseType } from "../../../types/db";
import { EmbedBotError, EmbedNotRegister, isHaveDonatorRole } from "../../../lib/discord";
import { getUserBalance } from "../../../db/economy";
import { transferMoney } from "../../../db/bank";
import { numberWithCommas } from "../../../lib/format";

function caculateFee(amount: number, isDonater: boolean) {
    if(isDonater) return amount;
    return Math.floor(amount - (amount * 0.1));
}

const PingCommand: Command = {
    name: "송금",
    description: "[ 💸 ] 다른 유저한테 송금할수 있어요",
    options: {
        금액: {
            description: "💸 금액을 입력해주세요. (1000원 이상, 최대 수수료 10%)",
            required: true,
            type: "Integer",
        },
        유저: {
            description: "👤 송금할 유저를 선택해주세요",
            required: true,
            type: "User",
        },
    },
    async executes(bot, interaction) {
        await interaction.deferReply();
        if(!onlyNumberRegex.test(interaction.options.getInteger("금액")?.toString() || "")) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle("❌ 송금 금액은 숫자만 입력 가능합니다.")
                .setColor('Red')
                .setTimestamp()
            ]
        })
        if(interaction.options.getInteger("금액") as number < 1000) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle("❌ 최소 송금 금액은 1,000원입니다.")
                .setColor('Red')
                .setTimestamp()
            ]
        });

        const isRegister = checkAvailableUser(interaction.user.id)
        if ((await isRegister).status === APIResponseType.USER_NOT_REGISTERED) return await interaction.editReply({ embeds: [EmbedNotRegister] });

        const user = await bot.users.fetch(interaction.options.getUser("유저") || '');

        const isRecipientRegister = checkAvailableUser(user.id)
        if((await isRecipientRegister).status === APIResponseType.USER_NOT_REGISTERED) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle('❌ 상대방이 가입 되어있지 않습니다.')
                .setColor('Red')
                .setTimestamp()
            ]
        });

        if(user.bot) return await interaction.editReply("❌ 음 로봇은 서비스 접근 금지라네요... (끄적)");
        if(interaction.user.id === user.id) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle('❌ 자기 자신한테 송금할 수 없습니다. (저축 하시는건가..?)')
                .setColor('Red')
                .setTimestamp()
            ]
        });
        
        await interaction.editReply("🔍 송금중입니다...");
        
        const userBalance = getUserBalance(interaction.user.id);
        if(interaction.options.getInteger("금액") as number > ((await userBalance).data.balance as number)) return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle("❌ 송금 금액이 보유 금액보다 많습니다.")
                .setColor('Red')
                .setTimestamp()
            ], message: ''
        });

        const transferBalance = caculateFee(interaction.options.getInteger("금액") || 0, isHaveDonatorRole(interaction));

        transferMoney(interaction.user.id, user.id, interaction.options.getInteger("금액") as number, transferBalance).then(async (response) => {
            if(response.status === APIResponseType.DATA_NOT_UPDATED) {
                await interaction.editReply({ embeds: [EmbedBotError]});
            } else {
                await interaction.editReply({ embeds: [
                    new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(`💸 송금이 완료되었습니다!`)
                        .setTimestamp(Date.now())
                        .setDescription(`\`보내는 사람\` : ${userMention(interaction.user.id)}\n\`받는 사람\` : ${userMention(user.id)}\n\`송금 금액\` : ${numberWithCommas(Number(interaction.options.getInteger("금액")))}원\n\`수수료\` : ${numberWithCommas(interaction.options.getInteger("금액") as number - transferBalance)}원\n\`잔액\` : ${numberWithCommas(Number((await userBalance).data.balance) - Number(interaction.options.getInteger('금액')))}원`)
                ], content: ''})
            }
        })
    },
};


export default PingCommand;