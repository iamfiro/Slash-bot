import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";
import { EmbedBuilder, TextChannel, userMention } from "discord.js";

const event: EventListener<"interactionCreate"> = {
    type: "interactionCreate",
    async listener(bot, interaction) {
        if(!interaction.isModalSubmit()) return;
        if(interaction.customId !== 'modal_learn') return;

        const reconizeText = interaction.fields.getTextInputValue('name_learn_title');
        const message = interaction.fields.getTextInputValue('name_learn_value');

        const LearnLogEmbed = new EmbedBuilder()
            .setTitle('📕 츠니 가르치기 등록됨')
            .setFields({ name: '등록된 단어', value: `\`\`\`${reconizeText}\`\`\``, inline: true }, { name: '등록된 뜻', value: `\`\`\`${message}\`\`\``, inline: true }, { name: '등록한 유저', value: userMention(interaction.user.id) })
            .setTimestamp()
            .setColor('DarkRed')

        await prisma.teachText.findFirst({ where: { reconizeText }}).then(async (data) => {
            console.log(data)
            if(data !== null) return await interaction.reply({ content: `📕 | 이미 츠니가 알고있는 지식이에요!`, ephemeral: true });
            await prisma.teachText.create({ data: { reconizeText, message, userId: interaction.user.id }}).then(async (data) => {
                await interaction.reply({ content: `📕 | 츠니에게 성공적으로 가르쳤습니다! \n\`츠니야 ${reconizeText}\`로 사용하기`, ephemeral: true });
                (bot.channels.cache.get("1157273552958013450") as TextChannel).send({ embeds: [LearnLogEmbed] });
            })
        })
    }
}

export default event;