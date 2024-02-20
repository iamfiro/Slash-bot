import { EmbedBuilder, TextChannel } from "discord.js";
import { EventListener } from "octajs";

function sleep(ms: number) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

const eventListener: EventListener<"guildMemberAdd"> = {
    type: "guildMemberAdd",
    async listener(bot, member) {
        if (process.env.NODE_ENV === 'development') return;
        const welcomeEmbed = new EmbedBuilder()
            .setTitle("૮⑅ᐡ•ﻌ•ᐡა \"나랑놀자\" 에 오신것을 환영합니다!")
            .setDescription(
                `✧﹒<#1156161217379958844>에서 인사 부탁드립니다 <3
        ✧ :: <#1156162697726009365>에서 규칙을 읽어주세요 !𝅄𝇈
        ✧﹒각종 서버 이벤트는 <#1172436974716583966>에서 진행됩니다 <3`
            )
            .setThumbnail(member.user.avatarURL())
            .setAuthor({ name: member.user.globalName as string })
            .setColor(0x00A1FF)
            .setImage("https://cdn.discordapp.com/attachments/1156794469128077413/1200122104163614721/9d814ef0cf767842aa560d683e0f549c.png?ex=65c507ce&is=65b292ce&hm=5efb7099062aa2a3040b747235dfe9e8cc66bf998af6b3b7663d9733118d6067&")
            .setTimestamp(member.joinedTimestamp);
        const message = (
            bot.channels.cache.get("1200095486397386912") as TextChannel
        ).send({ content: `<@${member.user.id}>`, embeds: [welcomeEmbed] });
        (await message).react("<a:blobcatpop:1156234395179569232>");
            
        member.setNickname(`₊˚⸝🐙${member.user.username}`)
    },
};

export default eventListener;