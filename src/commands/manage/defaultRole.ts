import { GuildMember, TextChannel } from "discord.js";
import { Command } from "octajs/dist/package/command";

const command: Command = {
    name: "기본역할주기",
    description: "[ 🔒 ] 안내원만 사용할 수 있는 명령어입니다.",
    options: {
        user: {
            type: "User",
            description: "해당 유저",
            required: true
        },
    },
    async executes(bot, interaction) {
        if(!interaction?.guild) return;
        const user = await interaction.guild.members.fetch(interaction.user.id);
        if(!user.roles.cache.has('1205516817418690600')) interaction.reply({
            content: '⛔ 권한이 없습니다',
            ephemeral: true
        });

        const roleUser = interaction.options.getUser('user', true);
        const newUser = await interaction.guild.members.fetch(roleUser.id);

        newUser.roles.add('1155126393210945674')

        interaction.reply({
            content: '✅ 역할이 지급됨',
            ephemeral: true
        })
    },
};

export default command;
