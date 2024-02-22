import { EmbedBuilder, TextChannel } from "discord.js";
import type { EventListener } from "octajs";

function sleep(ms: number) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) { }
}

const event: EventListener<"interactionCreate"> = {
    type: "interactionCreate",
    async listener(bot, interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith('new_user_welcome')) return;
        const Embed = new EmbedBuilder()
            .setTitle('츠니봇 이벤트 발생')
            .setFields([
                {
                    name: '이벤트 타입',
                    value: '\`\`\`DM_WELCOME_INTERACTION\`\`\`'
                },
                {
                    name: '이벤트 값',
                    value: `\`\`\`${interaction.customId.split('new_user_welcome_')[1]}\`\`\``
                },
                {
                    name: '유저',
                    value: `<@${interaction.user.id}>`
                },
            ])
            .setColor(0x00A1FF)

        const message = (
            bot.channels.cache.get("1157273552958013450") as TextChannel
        ).send({ embeds: [Embed] });
        if (interaction.customId.split('new_user_welcome_')[1] === 'yes') {
            interaction.reply("<:neko_gift:1165189150740324452> 좋아요! 그럼 설명을 시작할게요!").then((msg) => {
                sleep(1000)
                interaction.user.send("⌛ 저희 서버는 `2024-01-27` <t:1706241600:R>에 만들어진 게임 서버에요!").then((msg) => {
                    sleep(3000)
                    interaction.user.send("😀 **리그오브레전드**, **발로란트**, **마인크래프트**등 게임을 좋아하는 다양한 사람이 모여있어요!\n\n").then((msg) => {
                        sleep(2000)
                        interaction.user.send("--------").then((msg) => {
                            sleep(2000)
                            interaction.user.send("다양한 정보는 https://discord.com/channels/1155126393152225371/1204383815661785148 에서 안내 요청을 해주세요").then((msg) => {
                                
                            })
                        })
                    })
                })
            })
        } else {
            interaction.reply({ content: '<:neko_sleep:1165188746078068776> 넴 알겠습니다 ...zzZ' })
        }
    }
}

export default event;
