import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { checkAvailableUserRegister } from "../../../db/user";


async function handler(interaction: ChatInputCommandInteraction) {
    checkAvailableUserRegister(interaction).then(async function(result) {
    })
}

export default {
    info: new SlashCommandBuilder()
    .setName("홀짝")
    .setDescription("🔴 홀 / 🔵 짝중 두개를 선택해 반반의 확률에게 베팅해보세요")
    .addStringOption(option =>
        option.setName('베팅금액')
        .setDescription('💸 베팅 금액을 입력해주세요. (1,000원 이상 ~ 100,000원 이하)')
        .setNameLocalizations({
            ko: '베팅금액'
        })
        .setDescriptionLocalizations({
            ko: '💸 베팅 금액을 입력해주세요. (1,000원 이상 ~ 100,000원 이하)'
        })
        .setRequired(true)
    ),
    handler
}