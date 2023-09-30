import type { EventListener } from "octajs";
import { check } from "korcen";
import prisma from "../../lib/prisma";
import { EmbedBuilder, TextChannel } from "discord.js";

const urlRegex = /(www|http:|https:)+[^\s]+[\w]/;

const customForbiddenWords = ['시새발']

const event: EventListener<"messageCreate"> = {
  type: "messageCreate",
  async listener(bot, message) {
    if(message.author.bot) return;
    if(message.channelId === '1156160773316423741') return; // 무정부 챗 감지 X
    var c = check(message.content);
    if(!c) {
        customForbiddenWords.forEach((value, index, array)=>{
            message.content.search(value) === -1 ? null : c = true;
        })
    }
    if(c) {
        if(urlRegex.test(message.content)) return;
        if(message.content.includes('analytics')) return;
        if(message.content.includes('애널리틱스')) return;
        const warn = new EmbedBuilder()
            .setColor('Red')
            .setTitle('🚨 비속어 감지')
            .setFields({ name: '감지된 메시지', value: `\`\`\`${message.content}\`\`\``, inline: true}, { name: '유저', value: `<@${message.author.id}>`, inline: true})
            .setThumbnail(message.author.avatarURL())
            .setTimestamp();
        (bot.channels.cache.get('1157273552958013450') as TextChannel).send({ embeds: [warn] })
        await prisma.badWord.create({
            data: {
                userId: message.author.id,
                message: `욕 사용 - ${message.content}`
            }
        });

        await prisma.badWord.findMany({
            where: {
                userId: message.author.id
            }
        }).then(async (data) => {
            await message.delete()
            if(data.length < 3) {
                const warn = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('🚨 제재 내역 : 경고')
                    .setDescription('아직은 제재 기록이 적어 제재는 드리지 않았지만 다음번에 적발시에는 제재가 적용될수 있습니다!\n\n**좋은 커뮤니티 조성을 위해 비속어를 사용을 자제해주세요!**')
                    .setFields({ name: '감지된 메시지', value: `\`\`\`${message.content}\`\`\``})
                    .setFooter({ text: '🚨 SLASH 커뮤니티 제공' })
                    .setTimestamp();
                message.author.send({ embeds: [warn]})
            } else {
                const warn = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('🚨 제재 내역 : 제재 적용')
                    .setAuthor({name: '제재 1회'})
                    .setDescription('SLASH 커뮤니티에서 자주 경고를 받으신 걸로 보입니다\n**타임아웃이 지급되었습니다** \n\n좋은 커뮤니티 조성을 위해 비속어를 사용을 자제해주세요!')
                    .setFields({ name: '감지된 메시지', value: `\`\`\`${message.content}\`\`\``}, { name: '제재 내역', value: '**타임아웃 3분**'})
                    .setFooter({ text: '🚨 SLASH 커뮤니티 제공' })
                    .setTimestamp();
                message.guild?.members.cache.get(message.author.id)?.timeout(60 * 1000 * 3).catch(() => {
                    console.log(`[ ❌ ] 타임아웃 적용중 오류가 발생했습니다 | 유저: ${message.author.displayName}(${message.author.id})`)
                });
                message.author.send({ embeds: [warn]})
            }
        })
    }
  },
};

export default event;