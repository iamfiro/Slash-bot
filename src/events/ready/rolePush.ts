import { ButtonBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, TextChannel } from "discord.js";
const fs = require("fs")
import type { EventListener } from "octajs";

const gameRole = [
    {
        label: "발로란트",
        id: "1163378134155022387",
        emoji: "1163376922139570256"
    },
    {
        label: "마인크래프트",
        id: "1163378214341722112",
        emoji: "1163376297595117628"
    },
    {
        label: "GTA5",
        id: "1163378257140396112",
        emoji: "1163376291190415400"
    },
    {
        label: "오버워치",
        id: "1163378292905218149",
        emoji: "1163376287205834832",
    },
    {
        label: "로블록스",
        id: "1163378367698055179",
        emoji: "1163378017129734196"
    },
]

const event: EventListener<"ready"> = {
    type: "ready",
    async listener(bot, client) {
        if(process.env.NODE_ENV === 'development') return;
        const channel = await client.channels.fetch('1156183493328502854') as TextChannel; // 나중에 변경
        if(!channel) return;
        const json = await JSON.parse(fs.readFileSync('src/events/ready/roleMessageId.json', 'utf8'));
        if(json.gameMessageId === '') {
            channel.send(`게임 관련 역할을 받으시려면 아래 버튼들을 눌러주세요.`).then(async (message) => {
                json.gameMessageId = message.id;

                await fs.writeFile('src/events/ready/roleMessageId.json', JSON.stringify(json), 'utf8', (err: any) => {
                    console.log('write file error', err)
                })
            })
        }

        const row = new ActionRowBuilder<ButtonBuilder>();

        gameRole.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId('rolebutton_' + role.id).setLabel(role.label).setStyle(ButtonStyle.Primary).setEmoji({ id: role.emoji })
            )
        });

        const fetchedMessage = await channel.messages.fetch(json.gameMessageId);

        fetchedMessage.edit({
            content: '게임 관련 역할을 받으시려면 아래 버튼들을 눌러주세요.',
            components: [row]
        })
    },
};

export default event;
