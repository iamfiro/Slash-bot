import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";

const event: EventListener<"interactionCreate"> = {
    type: "interactionCreate",
    async listener(bot, interaction) {
        if(!interaction.isButton()) return;
        if(!interaction.customId.startsWith('valorant-register')) return;
        const slice = interaction.customId.split('_');
        if(interaction.user.id !== slice[1]) return;

        await prisma.valorantRegister.findFirst({
            where: {
                userId: interaction.user.id,
                server: slice[2],
                valorantName: slice[3],
                valorantTag: slice[4],
            }
        }).then(async (data) => {
            if(data) {
                return interaction.reply(`❌ <@${interaction.user.id}>님 정보에 이미 등록된 계정입니다.`)
            } else {
                await prisma.valorantRegister.create({
                    data: {
                        userId: slice[1],
                        server: slice[2],
                        valorantName: slice[3],
                        valorantTag: slice[4],
                    },
                }).then(async () => {
                    interaction.reply(`<@${interaction.user.id}>님 **${slice[3]}#${slice[4]}** 계정이 등록되었습니다!`)
                }).catch(async () => {
                    return interaction.reply('❌ <@${interaction.user.id}>님 데이터 처리 중 오류가 발생했습니다.')
                })
            }
        })
    }
}

export default event;