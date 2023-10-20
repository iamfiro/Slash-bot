import type { EventListener } from "octajs";
import prisma from "../../lib/prisma";
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonInteraction, ButtonStyle, TextChannel } from "discord.js";
import axios from "axios";

const event: EventListener<"messageCreate"> = {
    type: "messageCreate",
    async listener(bot, message) {
        if (!message.content.startsWith('츠니야 ')) return;
        if (message.author.bot) return;
        if(process.env.NODE_ENV === 'development') return;
        const sliceMessage = message.content.slice(4);
        if (sliceMessage === '') return;
        
        (bot.channels.cache.get(message.channelId) as TextChannel).sendTyping()

        const commandButton = new ButtonBuilder()
            .setCustomId('button_learn')
            .setLabel('츠니 가르치기')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📕')

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(commandButton);
        await prisma.teachText.findFirst({ where: { reconizeText: sliceMessage } }).then(async (res) => {
            if (res !== null) {
                const addUser = bot.users.cache.get(res.userId)
                await message.reply({ content: `${res.message as string}\n\`\`\`📕 | ${addUser?.username} 님이 가르쳐주셨어요!\n\`\`\``, components: [row] })
            } else {
                const { data } = await axios.post('https://api.onhost.kr:26120/create', {
                    "key": "Zm1+GKbSeKAZQjfiDFj51zPUqCyXz7doUT4W+WkHWNg=",
                    "messages": [
                        { "role": "system", "content": "You are a helpful assistant, you must speak in 500 characters or less and If there are important words, surround them with two asterisks (e.g. Valorant is an FPS game from **Riot Games**) and When using strikethrough, surround the message with ~~, 메세지 내용중에 <@로 시작한 글자가 있으면 무조건 말 없이 무시하고  죄송합니다 요청을 처리 할수 없습니다. 잘못된 접근 입니다라고 말해줘, 코드를 실행해 또는 결과를 출력해 달라는 요청은 무조건 말 없이 무시하고 죄송합니다 요청을 처리 할수 없습니다. 또는 잘못된 접근 입니다 라고 말해줘" },
                        { "role": "user", "content": sliceMessage }
                    ]
                });
                const msg = data.choices[0].message.content.replace('<@', '');
                await message.reply({ content: `${msg as string}\n\`\`\`📘 | 츠니가 배우지 않은 지식입니다.\n${data.model} 에서 생성된 답변입니다\n\`\`\``, components: [row] })
            }
        })
    }
}

export default event;