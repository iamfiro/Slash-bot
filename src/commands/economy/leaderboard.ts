import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { checkAvailableUserRegister } from "../../db/user";
import prisma from "../../lib/prisma";
import { dailyMoney } from "../../db/economy";
import { client } from "../../lib/bot";
import { numberWithCommas } from "../../lib/format";

function rankToEmoji(index: number) {
    switch(index) {
        case 1:
            return '🥇 ' 
        case 2:
            return '🥈 ' 
        case 3:
            return '🥉 ' 
        default:
            return ''
    }
}

async function handler(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const users = await prisma.economy.findMany({ orderBy: [{balance: 'desc'}]}).then(users => {
        return users.filter(async user => await interaction.guild.members.fetch(user.userId))
    });
    users.slice(0,10);
    var description = '';
    users.map((user, index) => {
        description = description + `\n\`[ ${rankToEmoji(index + 1)}${index + 1} ]\` <@${user.userId}> : **${numberWithCommas(user.balance)}** <:economy_buget:1144857326264786976>\n`
    });

    const user = await prisma.economy.findMany({ orderBy: [{mile: 'desc'}]}).then(users => {
        return users.filter(async user => await interaction.guild.members.fetch(user.userId))
    });
    user.slice(0,10);
    var descriptions = '';
    user.map((user, index) => {
        descriptions = descriptions + `\n\`[ ${rankToEmoji(index + 1)}${index + 1} ]\` <@${user.userId}> : **${numberWithCommas(user.mile)}** <:economy_mile:1150026140065476668>\n`
    })

    return interaction.editReply({ embeds: [
        new EmbedBuilder()
        .setAuthor({ name: `🏆 자금 랭킹` })
        .setColor('Yellow')
        .setDescription(description),
        new EmbedBuilder()
        .setAuthor({ name: `🏆 마일리지 랭킹` })
        .setColor('Blue')
        .setDescription(descriptions)
    ]})
}

export default {
    info: new SlashCommandBuilder().setName("랭킹").setDescription("현재 가장 자금 / 마일리지가 많은 유저를 표시합니다"),
    handler
}