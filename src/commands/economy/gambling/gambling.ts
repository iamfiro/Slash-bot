import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { checkAvailableUserRegister } from "../../../db/user";
import { onlyNumberRegex } from "../../../lib/regex";
import { betMoney } from "../../../db/gambling";
import { numberWithCommas } from "../../../lib/format";

// 확율 0 ~ 180
function randomType(random: number) {
    if(random > 0 && random < 150) return 1.3;
    if(random > 150 && random < 300) return 2;
    if(random > 300 && random < 375) return 2.4;
    if(random > 375 && random < 450) return 3;
    if(random > 450 && random < 525) return 3.1;
    if(random > 525 && random < 600) return 5;
    return 0;
}

function randomMessage(scale: number) {
    switch(scale) {
        case 0: return '📉 아이고... 아쉬워요';
        case 1.3: return '📈 누군가가 말했어요, 티끌모아 태산이라고..';
        case 2: return '📈 두배둡두비부배따딴딴';
        case 2.4: return '📈 2.4% 뭐 평범하네요ㅋ';
        case 3: return '📈 3배가 나오시다니.. 대단하세요!';
        case 3.1: return '📈 3.141592...';
        case 5: return '📈 ⭐⭐⭐⭐⭐ 별이 다섯개!';
        case 1: return '📈 본전은 뽑았네요?!';
    }
}

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()
    if(interaction.channelId === '1143111566573703258') {
        checkAvailableUserRegister(interaction).then(async data => {
            if(!onlyNumberRegex.test(interaction.options.get('베팅금액').value.toString())) {
                const AmountMinimumErrorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(`🚫 베팅중 오류가 발생했습니다`)
                .setDescription('금액 입력이 올바르지 않습니다. 금액은 숫자만 넣어주세요')
                .setTimestamp(Date.now())
                return await interaction.editReply({ embeds: [AmountMinimumErrorEmbed]})
            }
            if(Number(interaction.options.get('베팅금액').value) < 1000) {
                const AmountMinimumErrorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(`🚫 베팅중 오류가 발생했습니다`)
                .setDescription('베팅은 1000원부터 가능합니다')
                .setTimestamp(Date.now())
                return await interaction.editReply({ embeds: [AmountMinimumErrorEmbed]})
            }
            if(Number(interaction.options.get('베팅금액').value) > data.balance) {
                const AmountMinimumErrorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle(`🚫 베팅중 오류가 발생했습니다`)
                .setDescription('베팅에 필요한 잔액이 부족합니다')
                .setTimestamp(Date.now())
                return await interaction.editReply({ embeds: [AmountMinimumErrorEmbed]})
            }
            const randomScale = randomType(Math.floor((Math.random()*(1000-1))+1));
            betMoney(interaction, randomScale, Number(interaction.options.get('베팅금액').value)).then(async data => {
                const successEmbed = new EmbedBuilder()
                    .setColor(randomScale === 0 ? 0x3498DB : 0xED4245)
                    .setTitle(randomMessage(randomScale))
                    .addFields({ name: '\u200B', value: '\u200B' },{ 
                        name: '배율 📊', 
                        value: randomScale.toString(), 
                        inline: true,
                    }, { 
                        name: '베팅 금액 🧾', 
                        value: numberWithCommas(Number(interaction.options.get('베팅금액').value)).toString() + '원\n', 
                        inline: true,
                    }, { 
                        name: '베팅 수익 💸', 
                        value: numberWithCommas((Number(interaction.options.get('베팅금액').value) * randomScale) - Number(interaction.options.get('베팅금액').value)).toString() + '원', 
                        inline: true,
                    }, { 
                        name: '내 잔고 💰', 
                        value: numberWithCommas(data.updateBalance).toString() + '원', 
                        inline: true,
                    });
                await interaction.editReply({embeds: [successEmbed]})
            })
        });
    } else {
        const notThisChannel = new EmbedBuilder()
            .setTitle('🚫 이 기능은 <#1143111566573703258>에서 사용해주세요')
            .setColor('Red')
        await interaction.editReply({ embeds: [notThisChannel] })
    }
}

export default {
    info: new SlashCommandBuilder()
        .setName("도박")
        .setDescription("[💸] 자신의 돈을 베팅하세요")
        .addStringOption(option =>
            option.setName('베팅금액')
            .setDescription('💸 베팅 금액을 입력해주세요. (1000원 이상)')
            .setNameLocalizations({
                ko: '베팅금액'
            })
            .setDescriptionLocalizations({
                ko: '💸 베팅 금액을 입력해주세요.'
            })
            .setRequired(true)
        ),
    handler
}