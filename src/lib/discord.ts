import { ChatInputCommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";

export async function isHaveDonatorRole(interaction: ChatInputCommandInteraction) {
    const isMemberBooster = await interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.find((role) => role.id === "1156506697087598693");
    const isMemberDonater = await interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache.find((role) => role.id === "1155126393236115601");

    return isMemberBooster || isMemberDonater;
}

export const EmbedBotError = new EmbedBuilder()
    .setTitle("❌ 알 수 없는 오류가 발생하였습니다.")
    .setDescription("잠시 후 다시 시도해주세요. <@535676248513314816>")
    .setColor("Red")

export const EmbedNotRegister = new EmbedBuilder()
    .setTitle("🚫 가입되지 않은 유저입니다.")
    .setDescription("\`/가입\`을 입력해 먼저 가입해주세요!")
    .setColor("Red")