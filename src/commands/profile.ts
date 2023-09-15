import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { checkAvailableUserRegister, getUserById } from "../db/user";
import { numberWithCommas } from "../lib/format";

async function handler(interaction: ChatInputCommandInteraction) {
    checkAvailableUserRegister(interaction).then(async function(datas) {
        const user = interaction.options.get('유저').value.toString();
        getUserById(user).then(async function(data) {
            const members = await interaction.guild.members.fetch(user);
            const d = new Date(members.joinedTimestamp);
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setThumbnail(members.user.avatarURL())
                    .setTitle(`${members.user.displayName}님의 정보`)
                    .addFields(
                        { name: '서버 참가일', value: `${d.getFullYear()}년 ${d.getMonth()}월 ${d.getDay()}일 ${d.getHours()}시 ${d.getMinutes()}분 ${d.getMinutes()}초` },
                        { name: '은행 💎', value: `<:economy_buget:1144857326264786976> x **${numberWithCommas(data.balance)}**원\n<:economy_mile:1150026140065476668> x **${numberWithCommas(data.mile)}**개`, inline: true },
                        { name: ' ', value: ' ' },
                        { name: '도박 통계 🎰', value: `<:economy_buget:1144857326264786976> 사용한 자금 : **${numberWithCommas(data.betWinValue + data.betFailedValue)}**원\n💵 성공 x **${numberWithCommas(data.betWin)}** <:economy_buget:1144857326264786976> 얻은자금 : **${numberWithCommas(data.betWinValue)}**원\n💸 실패 x **${numberWithCommas(data.betFailed)}** <:economy_buget:1144857326264786976> 잃은 자금 : **${numberWithCommas(data.betFailedValue)}**원\n\n✅ 성공 확률 : **${Math.floor((data.betWin / (data.betFailed + data.betWin)) * 100)}**%`, inline: true },
                    )
                    .setTimestamp()
                ]
            })   
        }) 
    })
}

export default {
    info: new SlashCommandBuilder().setName("프로필").setDescription("내 정보를 확인합니다")
    .addUserOption(options =>
        options.setName('유저')
        .setDescription('👤 표시할 유저를 선택해주세요')
        .setRequired(true),
    ),
    handler
}