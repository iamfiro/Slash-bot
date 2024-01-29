import type { EventListener } from "octajs";
import { EmbedBuilder, GuildMemberRoleManager, TextChannel } from "discord.js";
import { EmbedBotError } from "../../lib/discord";

const event: EventListener<"interactionCreate"> = {
    type: "interactionCreate",
    async listener(bot, interaction) {
        if(process.env.NODE_ENV === 'development') return;
        if(!interaction.isButton()) return;
        if(!interaction.customId.startsWith('rolebutton_')) return;
        await interaction.deferReply({ ephemeral: true });

        const role = interaction.guild?.roles.cache.get(interaction.customId.split('rolebutton_')[1]);
        if(!role) {
            interaction.editReply({
                embeds: [EmbedBotError]
            })
            return;
        }

        const hasRole = (interaction.member?.roles as GuildMemberRoleManager).cache.has(role.id);

        if(hasRole) {
            await (interaction.member?.roles as GuildMemberRoleManager).remove(role);
            await interaction.editReply(`${role} 역할이 제거 되었습니다.`)
            return;
        }

        await (interaction.member?.roles as GuildMemberRoleManager).add(role);
        await interaction.editReply(`${role} 역할이 추가 되었습니다.`)
        return;
    }
}

export default event;