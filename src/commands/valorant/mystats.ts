import type { Command } from "octajs/dist/package/command";
import { ActionRowBuilder, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import axios from "axios";
import winston from "winston";
import prisma from "../../lib/prisma";

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

function regionToEmoji(region: string) {
    switch (region) {
        case "kr":
            return "🇰🇷";
        case "ap":
            return "🌏";
        case "eu":
            return "🇪🇺";
        case "na":
            return "🇺🇸";
        default:
            return "❓";
    }
}

function tierToKorean(tier: string) {
    switch (tier) {
        case "Radiant":
            return tier.replace('Radiant', '레디언트');
        case "Immortal":
            return tier.replace('Immortal', '불멸');
        case "Ascendant":
            return tier.replace('Ascendant', '초월자');
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
    if (tier.startsWith('Ascendant')) return 0x2F814B;
    if (tier.startsWith('Diamond')) return 0xC388F1;
    if (tier.startsWith('Platinum')) return 0x4CA1B1;
    if (tier.startsWith('Gold')) return 0xFFD700;
    if (tier.startsWith('Silver')) return 0xD0D5D3;
    if (tier.startsWith('Bronze')) return 0x90754C;
    if (tier.startsWith('Iron')) return 0x3D3D3D;
    return 0x000000;
}

interface ValorantAccount {
    name: string;
    tag: string;
    server: string;
}

const PingCommand: Command = {
    name: "내발로전적",
    description: "[ 🎮 ] 츠니의 등록된 데이터를 기반해 발로란트 전적을 확인 합니다",
    async executes(bot, interaction) {
        await interaction.deferReply();
        await prisma.valorantRegister.findMany({
            where: {
                userId: interaction.user.id,
            }
        }).then(async (data) => {
            if (data.length === 0) {
                return await interaction.editReply("❌ 츠니에 등록된 데이터를 가져올수 없습니다\n`/내발로등록` 명령어를 사용해 발로란트 계정을 등록해주세요");
            }

            const AccountList = [] as ValorantAccount[];

            data.map(async (data) => {
                AccountList.push({
                    name: data.valorantName,
                    tag: data.valorantTag,
                    server: data.server,
                })
            });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`valorant-select-${interaction.user.id}`)
                .setPlaceholder('계정을 선택해주세요')
                .setMinValues(0)
                .setMaxValues(AccountList.length)
                .addOptions(
                    AccountList.map((data) =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`${data.name}#${data.tag}`)
                            .setDescription(`${regionToKorean(data.server)} 서버`)
                            .setValue(`${data.server}_${data.name}_${data.tag}`)
                            .setEmoji(regionToEmoji(data.server))
                    )
                )

            const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

            const reply = interaction.editReply({
                components: [actionRow]
            })

            const collector = (await reply).createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                filter: (i) => i.user.id === interaction.user.id,
                time: 60_000
            });

            collector.on('collect', async (i) => {
                if (!i.values.length) return;
                
                const server = i.values[0].split('_')[0];
                const name = i.values[0].split('_')[1];
                const tag = i.values[0].split('_')[2];

                try {
                    let currentTier = null as any
                    let valorantProfile = null as any
                    let lastMatches = null as any
                    let lastMatchesMMR = null as any

                    await axios.get(`https://api.henrikdev.xyz/valorant/v1/mmr/${server}/${name}/${tag}`).then(async (data) => {
                        currentTier = data.data.data.currenttier === null ? 'e' : data;
                        return await interaction.editReply({ content: '🔎 유저 정보 불러오는 중... (1 / 4)', components: [] });
                    }).catch(async () => {
                        currentTier = 'e'
                        return await interaction.editReply({ embeds: [UserNotFoundError], components: []  });
                    })

                    await axios.get(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}?force=false`).then(async (data) => {
                        await interaction.editReply('🔎 유저 정보 불러오는 중... (2 / 4)');
                        valorantProfile = data
                    }).catch(async () => {
                        valorantProfile = 'e'
                        return await interaction.editReply({ embeds: [UserNotFoundError] });
                    });

                    await axios.get(`https://api.henrikdev.xyz/valorant/v1/lifetime/matches/${server}/${name}/${tag}?mode=competitive&size=3`).then(async (data) => {
                        lastMatches = data.data.data.length === 0 ? 'e' : data;
                        await interaction.editReply('🔎 유저 정보 불러오는 중... (3 / 4)');
                    }).catch(async () => {
                        lastMatches = 'e'
                        return await interaction.editReply({ embeds: [UserNotFoundError] });
                    });

                    await axios.get(`https://api.henrikdev.xyz/valorant/v1/lifetime/mmr-history/${server}/${name}/${tag}?mode=competitive&size=3`).then(async (data) => {
                        lastMatchesMMR = data.data.data.length === 0 ? 'e' : data;
                        await interaction.editReply('🔎 유저 정보 불러오는 중... (4 / 4)');
                    }).catch(async () => {
                        lastMatches = 'e'
                        return await interaction.editReply({ embeds: [UserNotFoundError] });
                    });

                    const ValorantEmbed = new EmbedBuilder()
                        .setTitle(`${valorantProfile.data.data.name}#${valorantProfile.data.data.tag}`)
                        .setFooter({ text: `${valorantProfile.data.data.puuid} · ${valorantProfile.data.data.last_update}` })
                        .setFields([
                            {
                                name: '현재 인게임 레벨',
                                value: `${valorantProfile.data.data.account_level}레벨`,
                            },
                            {
                                name: '서버 지역',
                                value: `${regionToKorean(valorantProfile.data.data.region)}`,
                            }
                        ])
                        .setImage(valorantProfile.data.data.card.wide)
                        .setThumbnail(valorantProfile.data.data.card.small)
                        .setColor(0xF5555E)

                    let competitiveEmbed = null as unknown as EmbedBuilder;
                    if (currentTier !== 'e') competitiveEmbed = new EmbedBuilder()
                        .setTitle('경쟁전 정보')
                        .setThumbnail(currentTier.data.data.images.small)
                        .setColor(tierColor(currentTier.data.data.currenttierpatched))
                        .setFields([
                            {
                                name: '현재 티어',
                                value: tierToKorean(currentTier.data.data.currenttierpatched) as string || '',
                            },
                            {
                                name: '현재 점수',
                                value: currentTier.data.data.ranking_in_tier + '점',
                            },
                            {
                            name: '최근 게임에서 얻은 점수',
                            value: currentTier.data.data.mmr_change_to_last_game + '점',
                            }
                        ])

                    let lastMatchesEmbed = null as unknown as EmbedBuilder;
                    let lastMatchesFields = [] as any;
                    if (lastMatches !== 'e') {
                        lastMatches.data.data.forEach((match: any, i: number) => {
                            lastMatchesFields.push({
                                name: `${match.meta.map.name} · ${match.teams.red} - ${match.teams.blue} · ${lastMatchesMMR.data.data[i].last_mmr_change > 8 ? '승리' : lastMatchesMMR.data.data[i].last_mmr_change < 0 ? '패배' : '무승부'}`,
                                value: `요원 : **${match.stats.character.name}**\nKDA : **${match.stats.kills}/${match.stats.deaths}/${match.stats.assists}** · 헤드샷 : **${Math.floor((match.stats.shots.head / (match.stats.shots.head + match.stats.shots.body + match.stats.shots.leg)) * 100)}%** · 전투점수 **${match.stats.score}**점\n점수 변화 : **${lastMatchesMMR.data.data[i].last_mmr_change}**점`,
                            })
                        })
                    }
                    if (lastMatches !== 'e') lastMatchesEmbed = new EmbedBuilder()
                        .setTitle('최근 3개의 경쟁 매치')
                        .setColor(0x3c7de6)
                        .setFields(lastMatchesFields)

                    const embeds = [] as EmbedBuilder[];
                    embeds.push(ValorantEmbed);
                    if (currentTier !== 'e') {
                        embeds.push(competitiveEmbed);
                    } else {
                        embeds.push(UserNotFoundCompetive);
                    }
                    if (lastMatches !== 'e') embeds.push(lastMatchesEmbed);

                    await interaction.editReply({
                        content: '',
                        embeds: embeds.map(embed => embed.toJSON())
                    });
                } catch (error) {
                    console.log(error)
                }
            })
        })
    },
};

export default PingCommand;