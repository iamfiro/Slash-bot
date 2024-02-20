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
                        //     interaction.user.send("2️⃣ 다음으로 채널 소개를 해드릴게요!\n\n").then((msg) => {
                        //         sleep(2000)
                        //         interaction.user.send(`<#1200095532341788722> **개발(코딩) 관련 이야기**를 하는 곳이에요!\n\n`).then((msg) => {
                        //             sleep(2000)
                        //             interaction.user.send(`<#1200095615103807538> **봇을 사용하시거나 관련 이야기** 하는 곳이에요 (<a:neko_neko:1165189202590322698> 저기서 저를 만나실 수 있어요!)\n\n`).then((msg) => {
                        //                 sleep(2000)
                        //                 interaction.user.send(`<#1200687231300546651> **이 채널의 메시지는 관리자가 관여하지 않는 곳**이에요!\n모든 메시지의 책임은 사용자 본인에게 있습니다.\n\n`).then((msg) => {
                        //                     sleep(2000)
                        //                     interaction.user.send(`<#1200095742602256446> **사진을 올리는** 곳이에요!\n(<:i_:1189110772605911153>랑 비슷해요...)`).then((msg) => {
                        //                         sleep(2000)
                        //                         interaction.user.send(`제가 알려드릴껀 여기까지에요!`).then((msg) => {
                        //                             sleep(1000)
                        //                             interaction.user.send(`들어주셔서 고마워요 <:neko_kissheart:1165188685399085088>`).then((msg) => {
                        //                                 sleep(1000)
                        //                                 interaction.user.send(`<:neko_sleep:1165188746078068776> 츠니가 채팅방을 나갔습니다 ...zzZ`)
                        //                             })
                        //                         })
                        //                     })
                        //                 })
                        //             })
                        //         })
                        //     })
                        // })
                    })
                })
            })
        } else {
            interaction.reply({ content: '<:neko_sleep:1165188746078068776> 넴 알겠습니다 ...zzZ' })
        }
    }
}

export default event;