import { channel } from 'diagnostics_channel';
import daily from './commands/economy/daily';
import gambling from './commands/economy/gambling/gambling';
import transferBalance from './commands/economy/transferBalance';
import ping from './commands/ping';
import { client, rest } from './lib/bot';
import { EmbedBuilder, Events, Routes, TextChannel } from 'discord.js';
import leaderboard from './commands/economy/leaderboard';
import shop from './commands/shop';
import profile from './commands/profile';

client.on('ready', async() => {
    await rest.put(Routes.applicationCommands(process.env.BOT_ID ?? ''), {
        body: [
            ping.info.toJSON(),
            daily.info.toJSON(),
            gambling.info.toJSON(),
            transferBalance.info.toJSON(),
            leaderboard.info.toJSON(),
            shop.info.toJSON(),
            profile.info.toJSON(),
        ]
    })
    console.log(`✅ Logged in as ${client.user?.tag}!`);
    client.user.setActivity({
        name: '🔨 v1.0.2-alpha'
    })
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case 'ping': ping.handler(interaction); break;
            case '출석': daily.handler(interaction); break;
            case '도박': gambling.handler(interaction); break;
            case '송금': transferBalance.handler(interaction); break;
            case '랭킹': leaderboard.handler(interaction); break;
            case '상점': shop.handler(interaction); break;
            case '프로필': profile.handler(interaction); break;
        }
    } else if (interaction.isButton()) {
    }
});


// 인스타그램 채널 이벤트
client.on(Events.MessageCreate, async interaction => {
    if(interaction.channelId !== '1143112595268698154') return;
    if(interaction.attachments.size === 0) {
        interaction.delete();
        return;
    }
    interaction.react('🤣');
    interaction.react('😐');
    interaction.react('🙁');
    interaction.react('😫');
    interaction.react('😡');

    const t = new Date();
    const threadName = interaction.content === '' ? `${interaction.author.username} - ${t.getFullYear()}년 ${t.getMonth()}월 ${t.getDay()}일 ${t.getHours()}시 ${t.getMinutes()}분` : interaction.content;
    interaction.startThread({
        name: threadName
    })
});


// welcome 메시지
client.on(Events.GuildMemberAdd, async member => {
    const welcomeEmbed = new EmbedBuilder()
    .setTitle('📈 입국 로그')
    .setDescription(`<@${member.user.id}>님 게임, 코딩, 공부등 커뮤니티 서버 \`WeAre\`에 들어오신 것을 환영합니다!`)
    .setThumbnail(member.user.avatarURL())
    .setTimestamp(member.joinedTimestamp);
    const message = ( client.channels.cache.get('1081840683511447602') as TextChannel ).send({ embeds: [welcomeEmbed] });
    (await message).react('<:blobcatpop:1144846825203970110>');
    const role = member.guild.roles.cache.find(role => role.id === "1131491531904254043");
    member.roles.add(role)
});

;(async () => {
    client.login(process.env.BOT_TOKEN)
})()