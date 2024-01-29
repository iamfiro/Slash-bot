import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
import { checkAvailableUser, registerUser } from "../../db/user";
import { APIResponse, APIResponseType } from "../../types/db";
import { EmbedBotError } from "../../lib/discord";

export const alreadyRegister = new EmbedBuilder()
    .setTitle("❌ 이미 가입되어 있는 유저입니다")
    .setTimestamp(Date.now())
    .setColor("Red")

const PingCommand: Command = {
    name: "가입",
    description: "[ 📃 ] 가입해 츠니봇의 다양한 서비스들을 사용해보세요!",
    async executes(_, interaction) {
        checkAvailableUser(interaction.user.id).then(async (data: APIResponse) => {
            if(data.status === APIResponseType.USER_ALREADY_REGISTERED) return await interaction.reply({ embeds: [alreadyRegister] });
            const result = registerUser(interaction.user.id, interaction.user.username);
            if ((await result).status === APIResponseType.USER_REGISTERED_FAILED) return await interaction.reply({ embeds: [EmbedBotError] })
            const RegisterSuccess = new EmbedBuilder()
                .setTitle("✅ 가입이 완료되었습니다!")
                .setDescription("\`/출석\`을 사용해 보상을 받으실수 있어요!")
                .setColor("Green")
                .setTimestamp(Date.now())
                return await interaction.reply({embeds: [RegisterSuccess]});
        })
    },
};

export default PingCommand;