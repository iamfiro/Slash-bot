import { Command } from "octajs/dist/package/command";
import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

const LearnCommand: Command = {
    name: "가르치기",
    description: "[ 📕 ] 츠니에게 다양한 지식을 가르칠수 있어요!",
    async executes(_, interaction) {
        const modal = new ModalBuilder()
            .setTitle('📕 츠니에게 가르치기!')
            .setCustomId('modal_learn')
        const reconizeText = new TextInputBuilder()
            .setCustomId('name_learn_title')
            .setRequired(true)
            .setLabel('가르칠 단어를 입력해주세요!')
            .setStyle(TextInputStyle.Short)
        const message = new TextInputBuilder()
            .setCustomId('name_learn_value')
            .setRequired(true)
            .setLabel('가르칠 단어의 뜻을 입력해주세요!')
            .setStyle(TextInputStyle.Paragraph)

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reconizeText)
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(message)

        modal.addComponents(firstActionRow, secondActionRow)
        interaction.showModal(modal)
    },
};

export default LearnCommand;