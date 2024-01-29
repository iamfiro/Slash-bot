import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, TextChannel } from "discord.js";
import { EventListener } from "octajs";

function sleep(ms: number, msg:any) {
    msg.channel.sendTyping()
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

const eventListener: EventListener<"guildMemberAdd"> = {
    type: "guildMemberAdd",
    async listener(bot, member) {
        if (process.env.NODE_ENV === 'development') return;

        member.send({
            embeds: [
                new EmbedBuilder()
                .setDescription(`👋 안녕하세요 <@${member.user.id}>님!`)
            ]
        }).then((msg) => {
            sleep(2000, msg)
            member.send(`저는 "**나랑 놀자**" 서버 도우미 <:neko_peak:1165189100849078302> **츠니**라고 해요!`).then((msg) => {
                sleep(3000, msg)

                const row = new ActionRowBuilder<ButtonBuilder>()

                row.components.push(
                    new ButtonBuilder()
                        .setCustomId('new_user_welcome_yes')
                        .setLabel('응!')
                        .setEmoji({ id: '1165188666465996880' })
                        .setStyle(ButtonStyle.Secondary)
                )
                row.components.push(
                    new ButtonBuilder()
                        .setCustomId('new_user_welcome_no')
                        .setLabel('아니, 됐어')
                        .setEmoji({ id: '1165189166708043787' })
                        .setStyle(ButtonStyle.Secondary)
                )

                member.send({ content: `제가 서버 설명을 해도 될까요?`, components: [row] })
            })
        })
        
    },
};

export default eventListener;