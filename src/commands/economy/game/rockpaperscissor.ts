import { Command } from "octajs/dist/package/command";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'
import { DecreseBalance, IncreseBalance, getUserBalance } from "../../../db/economy";
import { checkAvailableUser } from "../../../db/user";
import { APIResponseType } from "../../../types/db";
import { EmbedBotError, EmbedNotRegister } from "../../../lib/discord";
import { onlyNumberRegex } from "../../../lib/regex";
import { numberWithCommas } from "../../../lib/format";
import { RockPaperScissorMoney } from "../../../db/game";

const choices = [
    {
        name: "가위",
        emoji: "✌",
        beats: "바위",
    },
    {
        name: "바위",
        emoji: "🌚",
        beats: "보",
    },
    {
        name: "보",
        emoji: "📃",
        beats: "가위",
    }
]

function randomChoice() {
    const randomNumber = Math.floor(Math.random() * choices.length);
    return choices[randomNumber].name;
}

const RockPaperScissorCommand: Command = {
    name: "가위바위보",
    description: "[ 🎮 ] 봇과 가위바위보를 하여 최대 2배 보상을 받으세요",
    options: {
        상대방: {
            description: "상대방을 선택해주세요",
            required: true,
            type: "String",
            choices: [
                {
                    name: "🐱 츠니와 하기",
                    value: "츠니",
                },
                {
                    name: "👤 멀티플레이",
                    value: "멀티",
                }
            ]
        },
        대결금액: {
            description: "가위바위보에 베팅할 금액을 입력해주세요",
            required: false,
            type: "Integer",
        },
        선택: {
            description: "✌ 가위 / 🌚 바위 / 📃 보 중 하나를 선택해주세요 (츠니와 대결 전용)",
            required: false,
            type: "String",
            choices: [
                {
                    name: "가위 ✌",
                    value: "가위",
                },
                {
                    name: "바위 🌚",
                    value: "바위",
                },
                {
                    name: "보 📃",
                    value: "보",
                },
            ],
        },
        매칭유저: {
            description: "👤 대결 할 유저를 선택 해주세요 (멀티플레이 전용)",
            required: false,
            type: "User",
        },
    },
    async executes(bot, interaction) {
        const opponent = interaction.options.getString("상대방") || '츠니';
        if (opponent === '츠니') {
            await interaction.deferReply();
            if (!onlyNumberRegex.test(interaction.options.getInteger("대결금액")?.toString() || "")) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("❌ 대결금액은 숫자만 입력 가능합니다.")
                    .setColor('Red')
                    .setTimestamp()
                ]
            })
            if (interaction.options.getInteger("대결금액") as number < 1000) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("❌ 최소 대결금액은 1,000원입니다.")
                    .setColor('Red')
                    .setTimestamp()
                ]
            });
    
            const isRegister = checkAvailableUser(interaction.user.id)
            if ((await isRegister).status === APIResponseType.USER_NOT_REGISTERED) return await interaction.editReply({ embeds: [EmbedNotRegister] });
    
            const userBalance = getUserBalance(interaction.user.id);
            if (interaction.options.getInteger("대결금액") as number > ((await userBalance).data.balance as number)) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("❌ 대결 금액이 보유 금액보다 많습니다.")
                    .setColor('Red')
                    .setTimestamp()
                ]
            });

            if(!interaction.options.getString("선택")) return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("❌ 가위/바위/보 중 선택을 해주세요")
                    .setColor('Red')
                    .setTimestamp()
                ]
            });
            const random = randomChoice();

            const userChoice = choices.find((choice) => choice.name === interaction.options.getString("선택"));
            const botChoice = choices.find((choice) => choice.name === random);

            if (userChoice === botChoice) {
                const tieEmbed = new EmbedBuilder()
                    .setTitle("😉 비겼네요 두근구근!")
                    .setColor("Yellow")
                    .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 비기셨습니다!`)
                    .setFooter({ text: '보상 없음' })
                    .setTimestamp()
                    .setFields(
                        { name: "봇", value: `${botChoice?.emoji} ${botChoice?.name}`, inline: true },
                        { name: "VS", value: '🌐', inline: true },
                        { name: "사용자", value: `${userChoice?.emoji} ${userChoice?.name}`, inline: true },
                    )
                await interaction.editReply({ embeds: [tieEmbed] });
            } else if (userChoice?.beats === botChoice?.name) {
                const result = DecreseBalance(interaction.user.id, interaction.options.getInteger("베팅금액") || 0)
                if ((await result).status === APIResponseType.DATA_UPDATED) {
                    const loseEmbed = new EmbedBuilder()
                        .setTitle("🐱 츠니가 이겼어요!")
                        .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 패배하셨습니다!`)
                        .setColor("Red")
                        .setTimestamp()
                        .setFields(
                            { name: "봇", value: `${botChoice?.emoji} ${botChoice?.name}`, inline: true },
                            { name: "VS", value: '🌐', inline: true },
                            { name: "사용자", value: `${userChoice?.emoji} ${userChoice?.name}`, inline: true },
                        )
                    await interaction.editReply({ embeds: [loseEmbed] });
                } else {
                    await interaction.editReply({ embeds: [EmbedBotError] });
                }

            } else {
                const result = IncreseBalance(interaction.user.id, interaction.options.getInteger("베팅금액") || 0)
                if ((await result).status === APIResponseType.DATA_UPDATED) {
                    const winEmbed = new EmbedBuilder()
                        .setTitle("🎉 실력을 더 키우고 다시 올게요!")
                        .setColor("Green")
                        .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 이기셨습니다!`)
                        .setTimestamp()
                        .setFields(
                            { name: "봇", value: `${botChoice?.emoji} ${botChoice?.name}`, inline: true },
                            { name: "VS", value: '🌐', inline: true },
                            { name: "사용자", value: `${userChoice?.emoji} ${userChoice?.name}`, inline: true },
                        )
                    await interaction.editReply({ embeds: [winEmbed] });
                } else {
                    await interaction.editReply({ embeds: [EmbedBotError] });
                }
            }
        } else {
            if (!onlyNumberRegex.test(interaction.options.getInteger("대결금액")?.toString() || "")) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("❌ 대결금액은 숫자만 입력 가능합니다.")
                        .setColor('Red')
                        .setTimestamp()
                ]
            })
            if (interaction.options.getInteger("대결금액") as number < 1000) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("❌ 최소 대결금액은 1,000원입니다.")
                        .setColor('Red')
                        .setTimestamp()
                ]
            });

            if (!interaction.options.getUser("매칭유저")) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("❌ 매칭할 유저를 선택해주세요.")
                        .setColor('Red')
                        .setTimestamp()
                ], ephemeral: true
            });
            const targetUser = await bot.users.fetch(interaction.options.getUser("매칭유저") || '');

            const isRegister = checkAvailableUser(interaction.user.id)
            if ((await isRegister).status === APIResponseType.USER_NOT_REGISTERED) return await interaction.reply({ embeds: [EmbedNotRegister] });

            const isRecipientRegister = checkAvailableUser(targetUser.id)
            if((await isRecipientRegister).status === APIResponseType.USER_NOT_REGISTERED) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('❌ 상대방이 가입 되어있지 않습니다.')
                    .setColor('Red')
                    .setTimestamp()
                ]
            });

            const userBalance = getUserBalance(interaction.user.id);
            if (interaction.options.getInteger("대결금액") as number > ((await userBalance).data.balance as number)) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('❌ 대결 금액이 보유 금액보다 많습니다.')
                    .setColor('Red')
                    .setTimestamp()
                ]
            });

            const recipientBalance = getUserBalance(interaction.user.id);
            if (interaction.options.getInteger("대결금액") as number > ((await recipientBalance).data.balance as number)) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("❌ 대결 금액이 상대방 보유 금액보다 많습니다.")
                    .setColor('Red')
                    .setTimestamp()
                ]
            });

            if (interaction.user.id === targetUser.id) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ 이 세계가 멀티버스가 아닌 이상 나 자신과는 게임을 할수 없어요ㅠ')
                        .setColor('Red')
                        .setTimestamp()
                ], ephemeral: true
            })

            if (targetUser.bot) return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ 봇에게 통신하고 있어요 신호가 잡히면 알려드릴게요 (지지직...)')
                        .setDescription('봇과 게임 할 수 없습니다.')
                        .setColor('Red')
                        .setTimestamp()
                ], ephemeral: true
            })

            const buttons = choices.map((choice) => {
                return new ButtonBuilder()
                    .setCustomId(choice.name)
                    .setLabel(choice.name)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(choice.emoji)
            });

            const embed = new EmbedBuilder()
                .setTitle('🌚 가위바위보 대결')
                .setDescription(`<@${targetUser.id}>님 차례 입니다!`)
                .setColor('Yellow')
                .setTimestamp()

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons)

            const reply = await interaction.reply({
                content: `<@${interaction.user.id}>님이 <@${targetUser.id}>님에게 가위바위보 대결을 신청했습니다!\n\n\`베팅 금액\` : ${numberWithCommas(Number(interaction.options.getInteger("대결금액")))}원\n\n대결을 수락하시려면 아래 버튼들을 눌러주세요`,
                embeds: [embed],
                components: [row]
            });

            const targetUserInteraction = await reply.awaitMessageComponent({
                filter: (i) => i.user.id === targetUser.id,
                time: 20_000,
            }).catch(async (e) => {
                embed.setColor('Red')
                embed.setDescription(`<@${targetUser.id}>님이 대결을 거절하셨습니다.\n\`시간 초과\``)
                await reply.edit({ embeds: [embed], components: [], content: `<@${interaction.user.id}>님이 <@${targetUser.id}>님에게 가위바위보 대결을 신청했습니다!` });
            });

            if (!targetUserInteraction) return;

            const targetUserChoice = choices.find((choice) => choice.name === targetUserInteraction.customId);

            await targetUserInteraction.reply({
                content: `[ ${targetUserChoice?.emoji} ] ${targetUserChoice?.name}을 선택하셨습니다`,
                ephemeral: true
            })

            embed.setDescription(`<@${interaction.user.id}>님 차례 입니다!`)
            await reply.edit({ content: `**차례가 변경 되었습니다**\n\`베팅 금액\` : ${numberWithCommas(Number(interaction.options.getInteger("대결금액")))}원`, embeds: [embed] });

            const initialUserInteraction = await reply.awaitMessageComponent({
                filter: (i) => i.user.id === interaction.user.id,
                time: 20_000,
            }).catch(async (e) => {
                embed.setColor('Red')
                embed.setDescription(`<@${targetUser.id}>님이 대결을 거절하셨습니다.\n\`시간 초과\``)
                await reply.edit({ embeds: [embed], components: [], content: `<@${interaction.user.id}>님이 <@${targetUser.id}>님에게 가위바위보 대결을 신청했습니다!` });
            });

            if (!initialUserInteraction) return;

            const initialUserChoice = choices.find((choice) => choice.name === initialUserInteraction.customId);

            if (targetUserChoice?.name === initialUserChoice?.name) {
                embed.setTitle("😉 비겼습니다")
                embed.setDescription(`<@${interaction.user.id}>님과 <@${targetUser.id}>님이 가위바위보에서 비기셨습니다!`)
                embed.setFields(
                    { name: interaction.user.displayName, value: `${targetUserChoice?.emoji} ${targetUserChoice?.name}`, inline: true },
                    { name: "VS", value: '🌐', inline: true },
                    { name: targetUser.displayName, value: `${initialUserChoice?.emoji} ${initialUserChoice?.name}`, inline: true },
                )
                embed.setFooter({ text: '각자 보상 없음' })
                await reply.edit({ embeds: [embed], components: [], content: `<@${interaction.user.id}>님이 <@${targetUser.id}>님에게 가위바위보 대결을 신청했습니다!` });
            }

            if (initialUserChoice?.beats === targetUserChoice?.name) {
                const result = RockPaperScissorMoney(targetUser.id, interaction.user.id, interaction.options.getInteger("대결금액") || 0)
                if((await result).status === APIResponseType.DATA_UPDATED) {
                    embed.setTitle(`🎉 ${targetUser.displayName}님이 이기셨습니다!`)
                    embed.setDescription(`<@${targetUser.id}>님이 <@${interaction.user.id}>님을 이기셨습니다!`)
                    embed.setFields(
                        { name: interaction.user.displayName, value: `${initialUserChoice?.emoji} ${initialUserChoice?.name}`, inline: true },
                        { name: "VS", value: '🌐', inline: true },
                        { name: targetUser.displayName, value: `${targetUserChoice?.emoji} ${targetUserChoice?.name}`, inline: true },
                    )
                    await reply.edit({ embeds: [embed], components: [], content: `<@${interaction.user.id}>님이 <@${targetUser.id}>님에게 가위바위보 대결을 신청했습니다!` });
                } else {
                    await reply.edit({ embeds: [EmbedBotError], components: [], content: `<@${interaction.user.id}>님이 <@${targetUser.id}>님에게 가위바위보 대결을 신청했습니다!` })
                }
            }

            if (initialUserChoice?.name === targetUserChoice?.beats) {
                const result = RockPaperScissorMoney(interaction.user.id, targetUser.id, interaction.options.getInteger("대결금액") || 0)

                if((await result).status === APIResponseType.DATA_UPDATED) {
                    embed.setTitle(`🎉 ${interaction.user.displayName}님이 이기셨습니다!`)
                    embed.setDescription(`<@${interaction.user.id}>님이 <@${targetUser.id}>님을 이기셨습니다!`)
                    embed.setFields(
                        { name: interaction.user.displayName, value: `${initialUserChoice?.emoji} ${initialUserChoice?.name}`, inline: true },
                        { name: "VS", value: '🌐', inline: true },
                        { name: targetUser.displayName, value: `${targetUserChoice?.emoji} ${targetUserChoice?.name}`, inline: true },
                    )
                    await reply.edit({ embeds: [embed], components: [], content: `<@${interaction.user.id}>님이 <@${targetUser.id}>님에게 가위바위보 대결을 신청했습니다!` });
                } else {
                    await reply.edit({ embeds: [EmbedBotError], components: [], content: `<@${interaction.user.id}>님이 <@${targetUser.id}>님에게 가위바위보 대결을 신청했습니다!` })
                }
            }
        }
    },
};

export default RockPaperScissorCommand;