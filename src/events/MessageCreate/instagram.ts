import type { EventListener } from "octajs";

const event: EventListener<"messageCreate"> = {
    type: "messageCreate",
    async listener(bot, message) {
        if(message.author.bot) return;
        if(message.channelId !== '1200095742602256446') return;

        if(message.attachments.size === 0) message.delete();

        message.react('👍');
        message.react('❤');
        message.react('😂');
        message.react('😱');
        message.react('😕');

        const date = new Date();

        const threadName = message.content !== '' ? message.content : `${message.author.username} - ${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`

        message.startThread({
            name: threadName,
        })
    }
}

export default event;