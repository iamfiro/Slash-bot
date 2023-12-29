import type { Command } from "octajs/dist/package/command";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import axios from "axios";
import winston from "winston";

const UserNotFoundError = new EmbedBuilder()
    .setTitle("❌ 유저를 찾을수 없습니다")
    .setColor("Red")
    .setTimestamp();

const UserNotFoundCompetive = new EmbedBuilder()
    .setTitle("❌ 경쟁전 정보를 찾을수 없습니다")
    .setColor("Red")
    .setTimestamp();

function regionToKorean(region: string) {
    switch (region) {
        case "kr":
            return "대한민국";
        case "ap":
            return "아시아";
        case "eu":
            return "유럽";
        case "na":
            return "북아메리카";
        default:
            return "알수없음";
    }
}

function tierToKorean(tier: string) {
    console.log(tier)
    switch (tier) {
        case "Radiant":
            return tier.replace('Radiant', '레디언트');
        case "Immortal":
            return tier.replace('Immortal', '초월자');
        case "Diamond":
            return tier.replace('Diamond', '다이아몬드');
        case "Platinum":
            return tier.replace('Platinum', '플래티넘');
        case "Gold":
            return tier.replace('Gold', '골드');
        case "Silver":
            return tier.replace('Silver', '실버');
        case "Bronze":
            return tier.replace('Bronze', '브론즈');
        case "Iron":
            return tier.replace('Iron', '아이언');
        default:
            return tier;
    }
}

function tierColor(tier: string) {
    if (tier.startsWith('Radiant')) return 0xCC9E4D;
    if (tier.startsWith('Immortal')) return 0xB83B52;
    if (tier.startsWith('Diamond')) return 0xC388F1;
    if (tier.startsWith('Platinum')) return 0x4CA1B1;
    if (tier.startsWith('Gold')) return 0xFFD700;
    if (tier.startsWith('Silver')) return 0xD0D5D3;
    if (tier.startsWith('Bronze')) return 0x90754C;
    if (tier.startsWith('Iron')) return 0x3D3D3D;
    return 0x000000;
}

const PingCommand: Command = {
    name: "내발로등록",
    description: "발로란트 정보를 츠니에 등록합니다",
    options: {
        지역: {
            description: "발로란트 서버",
            required: true,
            type: "String",
            choices: [
                {
                    name: "대한민국",
                    value: "kr",
                },
                {
                    name: "아시아",
                    value: "ap",
                },
                {
                    name: "유럽",
                    value: "eu",
                },
                {
                    name: "북아메리카",
                    value: "na",
                },
            ],
        },
        이름: {
            description: "이름",
            required: true,
            minLength: 0,
            maxLength: 100,
            type: "String",
        },
        태그: {
            description: "태그",
            required: true,
            minLength: 0,
            maxLength: 100,
            type: "String",
        },
    },
    async executes(bot, interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('이름') || ''
        const server = interaction.options.getString('지역') || ''
        const tag = interaction.options.getString('태그') || ''
        if (!name || !tag || !server) {
            return await interaction.editReply("❌ 이름, 태그, 지역은 비워둘수 없습니다");
        }

        await axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}?force=false`).then(async (data) => {
            const Embed = new EmbedBuilder()
                .setTitle("✅ 이 계정이 맞나요?")
                .setDescription(`\n**플레이어 이름**\n${data.data.data.name}#${data.data.data.tag}\n\n**현재 인게임 레벨**\n${data.data.data.account_level}레벨`)
                .setImage(data.data.data.card.wide)
                .setThumbnail(data.data.data.card.small)
                .setTimestamp()

            const row = new ActionRowBuilder<ButtonBuilder>()

            row.components.push(
                new ButtonBuilder()
                    .setLabel('✅ 네, 맞아요')
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(`valorant-register_${interaction.user.id}_${data.data.data.region}_${data.data.data.name}_${data.data.data.tag}`)
            )
            
            interaction.editReply({ embeds: [Embed], components: [row] })
        }).catch(async () => {
            return await interaction.editReply({ embeds: [UserNotFoundError] });
        });
    },
};

export default PingCommand;