import { GuildMember, TextChannel } from "discord.js";
import { Command } from "octajs/dist/package/command";

const command: Command = {
    name: "유저이름세팅",
    description: "[ 🔒 ] 서버 인원의 이름을 변경합니다.",
    async executes(bot, interaction) {
        if(!interaction?.guild) return;
 
        // const ModerRole = "1155126393236115606"
        // const HelperManagerRole = "1205517934261440582"
        // const HelperRole = "1205516817418690600"
        // const RetiredRole = "1201153662517530694"
        // const BotRole = "1155126393210945673"
        // const YoutuberRole = "1155126393236115598"
        // const UserRole = "1155126393210945674"

        // interaction?.guild.members.fetch().then((members) =>
        //     members.forEach((member) => {
        //         if(member.user.id === "924486688108068895") return;
        //         if(member.roles.cache.has(ModerRole)) {
        //             member.setNickname(`₊˚⸝🔒${member.user.displayName}`)
        //             return;
        //         } else if(member.roles.cache.has(HelperManagerRole)) {
        //             member.setNickname(`₊˚⸝🐬${member.user.displayName}`)
        //             return;
        //         } else if(member.roles.cache.has(HelperRole)) {
        //             member.setNickname(`₊˚⸝🐋${member.user.displayName}`)
        //             return;
        //         } else if(member.roles.cache.has(RetiredRole)) {
        //             member.setNickname(`₊˚⸝🐟${member.user.displayName}`)
        //             return;
        //         } else if(member.roles.cache.has(BotRole)) {
        //             member.setNickname(`₊˚⸝🤖${member.user.displayName}`)
        //             return;
        //         } else if(member.roles.cache.has(YoutuberRole)) {
        //             member.setNickname(`₊˚⸝📺${member.user.displayName}`)
        //             return;
        //         } else if(member.roles.cache.has(UserRole)) {
        //             member.setNickname(`₊˚⸝🐙${member.user.displayName}`)
        //             return;
        //         }
        //     }),
        // );
        // interaction.reply('댐 ㅅㄱ ㅋ')
    },
};

export default command;
