import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
import { DecreseBalance, IncreseBalance } from "../../../db/economy";
import { checkAvailableUser } from "../../../db/user";
import { APIResponseType } from "../../../types/db";
import { EmbedBotError, EmbedNotRegister } from "../../../lib/discord";
import { onlyNumberRegex } from "../../../lib/regex";

const PingCommand: Command = {
    name: "가위바위보",
    description: "봇과 가위바위보를 하여 최대 2배 보상을 받으세요",
    options: {
        베팅금액: {
            description: "가위바위보에 베팅할 금액을 입력해주세요",
            required: true,
            type: "Integer",
        },
        선택: {
            description: "가위바위보에 베팅할 금액을 입력해주세요",
            required: true,
            type: "String",
            choices: [
                {
                    name: "가위 ✌",
                    value: "1",
                },
                {
                    name: "바위 🌚",
                    value: "2",
                },
                {
                    name: "보 📃",
                    value: "3",
                },
            ],
        },
    },
    async executes(_, interaction) {
        await interaction.deferReply();
        if(!onlyNumberRegex.test(interaction.options.getInteger("베팅금액")?.toString() || "")) return await interaction.editReply("❌ 베팅금액은 숫자만 입력 가능합니다.")
        if(interaction.options.getInteger("베팅금액") as number < 1000) return await interaction.editReply("❌ 최소 베팅금액은 1,000원입니다.");
        const isRegister = checkAvailableUser(interaction.user.id)
        if ((await isRegister).status === APIResponseType.USER_NOT_REGISTERED) return await interaction.editReply({ embeds: [EmbedNotRegister] });
        const choice = interaction.options.getString("선택");
        const random = Math.floor(Math.random() * 3) + 1;

        if (random.toString() === choice) {
            const winEmbed = new EmbedBuilder()
                .setTitle("😉 비기셨습니다!")
                .setColor("Yellow")
                .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 비기셨습니다!`)
                .setFooter({ text: '보상 없음'})
                .setTimestamp()
                .setFields(
                    { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
                    { name: "VS", value: '🌐', inline: true },
                    { name: "사용자", value: choice === "1" ? "가위 ✌" : choice === "2" ? "바위 🌚" : "보 📃", inline: true },
                )
            await interaction.editReply({ embeds: [winEmbed] });
        } else if ((random.toString() === "1" && choice === "3") || (random.toString() === '2' && choice === "1") || (random.toString() === '3' && choice === "2")) {
            const result = DecreseBalance(interaction.user.id, interaction.options.getInteger("베팅금액") || 0)
            if ((await result).status === APIResponseType.DATA_UPDATED) {
                const loseEmbed = new EmbedBuilder()
                    .setTitle("😥 아쉽습니다")
                    .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 패배하셨습니다!`)
                    .setColor("Red")
                    .setTimestamp()
                    .setFields(
                        { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
                        { name: "VS", value: '🌐', inline: true },
                        { name: "사용자", value: choice === "1" ? "가위 ✌" : choice === "2" ? "바위 🌚" : "보 📃", inline: true },
                    )
                await interaction.editReply({ embeds: [loseEmbed] });
            } else {
                await interaction.editReply({ embeds: [EmbedBotError] });
            }

        } else {
            const result = IncreseBalance(interaction.user.id, interaction.options.getInteger("베팅금액") || 0)
            if ((await result).status === APIResponseType.DATA_UPDATED) {
                const winEmbed = new EmbedBuilder()
                    .setTitle("🎉 축하합니다!")
                    .setColor("Green")
                    .setDescription(`<@${interaction.user.id}>님이 가위바위보에서 이기셨습니다!`)
                    .setTimestamp()
                    .setFields(
                        { name: "봇", value: random === 1 ? "가위 ✌" : random === 2 ? "바위 🌚" : "보 📃", inline: true },
                        { name: "VS", value: '🌐', inline: true },
                        { name: "사용자", value: choice === "1" ? "가위 ✌" : choice === "2" ? "바위 🌚" : "보 📃", inline: true },
                    )
                await interaction.editReply({ embeds: [winEmbed] });
            } else {
                await interaction.editReply({ embeds: [EmbedBotError] });
            }
        }
    },
};

export default PingCommand;