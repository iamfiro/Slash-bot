import { Command } from "octajs/dist/package/command";
import { EmbedBuilder } from 'discord.js'
import { onlyNumberRegex } from "../../../lib/regex";
import { checkAvailableUser } from "../../../db/user";

const PingCommand: Command = {
    name: "송금",
    description: "💸 다른 유저한테 송금할수 있어요",
    options: {
        금액: {
            description: "💸 금액을 입력해주세요. (1000원 이상, 수수료 10%)",
            required: true,
            type: "String",
        },
        유저: {
            description: "👤 송금할 유저를 선택해주세요",
            required: true,
            type: "User",
        },
    },
    async executes(bot, interaction) {

    },
};


export default PingCommand;