import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";

const event: EventListener<"interactionCreate"> = {
    type: "interactionCreate",
    async listener(bot, interaction) {
        if(!interaction.isModalSubmit()) return;
        if(interaction.customId !== 'modal_learn') return;

        const reconizeText = interaction.fields.getTextInputValue('name_learn_title');
        const message = interaction.fields.getTextInputValue('name_learn_value');

        await prisma.teachText.findFirst({ where: { reconizeText }}).then(async (data) => {
            console.log(data)
            if(data !== null) return await interaction.reply({ content: `📕 | 이미 츠니가 알고있는 지식이에요!`, ephemeral: true });
            await prisma.teachText.create({ data: { reconizeText, message, userId: interaction.user.id }}).then(async (data) => {
                await interaction.reply({ content: `📕 | 츠니에게 성공적으로 가르쳤습니다! \n\`츠니야 ${reconizeText}\`로 사용하기`, ephemeral: true });
            })
        })
    }
}

export default event;