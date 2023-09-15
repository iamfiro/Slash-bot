import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { checkAvailableUserRegister } from "../../db/user";
import { dailyMoney } from "../../db/economy";
import { client } from "../../lib/bot";
import { numberWithCommas } from "../../lib/format";

const alreadyGetDaily = new EmbedBuilder()
    .setTitle('❌ 이미 오늘은 보상을 받으셨네요')
    .setDescription('내일 다시 시도해주세요')
    .setColor('Red')

async function handler(interaction: ChatInputCommandInteraction) {
    checkAvailableUserRegister(interaction).then(async function(result) {
        const t = (new Date());
        t.setHours(t.getHours() + 9)
        const today = `${t.getFullYear()}${t.getMonth()}${t.getDate()}`;

        if(today === result?.lastUsedDailyCommand) {
        // if(false) {
            await interaction.deferReply({ ephemeral: false });
            await interaction.editReply({embeds: [alreadyGetDaily]});
        } else {
            await interaction.deferReply();
            const randomAmt = (Math.floor(Math.random() * (15000 - 11000 + 1)) + 11000) + (40 * (result?.dailyCommandCount || 0));
            const emoji = client.emojis.cache.get(':bellslarge:');
            dailyMoney(interaction, randomAmt).then(async data => {
                const GetDaily = new EmbedBuilder()
                .setTitle('✅ 출석 체크가 완료 되었습니다')
                .setDescription(`**${numberWithCommas(randomAmt)}** x 자금 <:economy_buget:1144857326264786976>\n **10** x 마일리지 <:economy_mile:1150026140065476668>`)
                .setColor('Green')
                .setTimestamp()
                .setFooter({ text: `총 ${numberWithCommas(data?.dailyCommandCount || 0 )}번의 출석`});
                await interaction.editReply({embeds: [GetDaily]})
            })
        }
    })
}

export default {
    info: new SlashCommandBuilder().setName("출석").setDescription("매일 주어지는 보상을 받으실수 있어요!  (많이 할수록 더 받을수 있다는 소문이...)"),
    handler
}