import { TextChannel } from "discord.js";
import { EventListener } from "octajs";

const eventListener: EventListener<"guildMemberRemove"> = {
    type: "guildMemberRemove",
    async listener(bot, member) {
        if (process.env.NODE_ENV === 'development') return;
        const countChannel = bot.channels.cache.get("1206593629607690293") as TextChannel;
        countChannel.setName(`ʚ・💌﹕${member.guild.memberCount}・ɞ`)
    },
};

export default eventListener;
