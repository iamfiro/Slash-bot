import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
import * as simplydjs from 'simply-djs';
import { ChatInputCommandInteraction } from 'discord.js';

const CalcCommand: Command = {
    name: "계산기",
    description: "숫자를 계산합니다",
    async executes(_, interaction: ChatInputCommandInteraction) {
        await simplydjs.calculator(interaction as any)
    },
};

export default CalcCommand;