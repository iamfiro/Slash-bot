import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
import { checkAvailableUser, getUserById } from "../../db/user";
import { DailyBalance } from "../../db/economy";
import { EmbedBotError } from "../../lib/discord";
import { getTodayStringDate } from "../../lib/date";
import { isHaveDonatorRole, EmbedNotRegister } from "../../lib/discord";
import { APIResponse, APIResponseType } from "../../types/db";

const alreadyGetDaily = new EmbedBuilder()
    .setTitle("❌ 이미 오늘은 보상을 받으셨네요")
    .setDescription("내일 다시 시도해주세요")
    .setColor("Red");

const PingCommand: Command = {
    name: "출석",
    description: "[ 💰 ] 매일 주어지는 보상을 받으실수 있어요!",
    async executes(bot, interaction) {
        await interaction.deferReply();
        if (!interaction.member) return await interaction.reply("❌ 서버에서 사용해주세요");
        
        const isRegister = checkAvailableUser(interaction.user.id);
        if((await isRegister).status === APIResponseType.USER_NOT_REGISTERED) return await interaction.editReply({ embeds: [EmbedNotRegister] });

        const data = getUserById(interaction.user.id);

        const today = getTodayStringDate();
        if (today === (await data).data?.Economy.lastUsedDailyCommand) return await interaction.editReply({ embeds: [alreadyGetDaily] });
        const isDonator = await isHaveDonatorRole(interaction);

        DailyBalance(interaction.user.id, isDonator ? 20000 : 10000).then(async (data: APIResponse) => {
            if(data.status === APIResponseType.DATA_NOT_UPDATED) return await interaction.editReply({ embeds: [EmbedBotError] });
            await interaction.editReply({ embeds: [
                    new EmbedBuilder()
                    .setColor(0x57F287)
                    .setTitle(`✅ 출석 체크 완료`)
                    .setDescription(`보상으로 ${isDonator ? '20,000' : '10,000'}원이 입금되었습니다.${isDonator ? '\nㄴ <:booster:1156511127652552745> 후원자 전용 혜택 (**출석 체크 보상 2배**)' : ''}`)
                    .setTimestamp(Date.now())
                ]
            })
        })
    },
};

export default PingCommand;